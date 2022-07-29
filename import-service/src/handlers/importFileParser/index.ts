import AWS from 'aws-sdk';
import { S3Event } from 'aws-lambda';
import csv from 'csv-parser';

import { logger } from '../../utils/logger';

export const importFileParser = async (event: S3Event): Promise<void> => {
  const s3 = new AWS.S3({ signatureVersion: 'v4', region: 'us-east-1' });
  logger.info('Importing file parser...');

  try {
    for (const record of event.Records) {
      const BUCKET = record.s3.bucket.name;
      const key = record.s3.object.key;

      const params = {
        Bucket: BUCKET,
        Key: key,
      };

      logger.info(`CHECK PARAMS  ${params}`);

      await new Promise((resolve, reject) => {
        s3.getObject(params)
          .createReadStream()
          .pipe(csv())
          .on('data', (data) => {
            logger.info(`Data file:  ${JSON.stringify(data)}`);
          })
          .on('error', (err) => {
            logger.info(`Error file:  ${err}`);
            reject(`Failed: ${err}`);
          })
          .on('end', async () => {
            logger.info(`Copy from ${BUCKET}/${key}`);

            await s3
              .copyObject({
                Bucket: BUCKET,
                CopySource: `${BUCKET}/${key}`,
                Key: key.replace('uploaded', 'parsed'),
              })
              .promise()
              .then(() => logger.info(`Copy to ${BUCKET}/${key}`));

            await s3
              .deleteObject({
                Bucket: BUCKET,
                Key: key,
              })
              .promise()
              .then(() => logger.info(`Delete ${BUCKET}/${key}`));

            resolve(null);
          });
      });
    }
  } catch (error) {
    logger.error(`Internal Error importing products file: ${error}`);
  }
};
