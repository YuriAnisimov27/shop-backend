import AWS from 'aws-sdk';
import { APIGatewayProxyEvent } from 'aws-lambda';

import {
  buildResponseFailure,
  buildSuccessResponse,
  LambdaResponseSerialized,
} from '../../utils/responses';
import { logger } from '../../utils/logger';
import { config } from 'src/utils/config';

const BUCKET = config.BUCKET;

export const importProductsFile = async (
  event: APIGatewayProxyEvent
): Promise<LambdaResponseSerialized> => {
  const s3 = new AWS.S3({ signatureVersion: 'v4', region: 'us-east-1' });
  logger.info('Importing products file...');

  try {
    if (event.queryStringParameters && event.queryStringParameters.name) {
      const catalogPath = `uploaded/${event.queryStringParameters.name}`;
      logger.info(`Path: ${catalogPath}, BUCKET: ${BUCKET}`);

      const params = {
        Bucket: BUCKET,
        Key: catalogPath,
        Expires: 300,
        ContentType: 'text/csv',
      };

      const url = await s3
        .getSignedUrlPromise('putObject', params)
        .catch((err) => {
          logger.error(`getSignedUrlPromise Error: ${err.message}`);
          return buildResponseFailure(500, 'Internal Error');
        });

      logger.info(
        { signedUrl: url },
        `receive importProductsFile: ${catalogPath}`
      );
      return buildSuccessResponse({ signedUrl: url });
    }

    logger.error('No file name provided');
    return buildResponseFailure(404, 'File not found');
  } catch (error) {
    logger.error(`Internal Error importing products file: ${error}`);
    return buildResponseFailure(500, error);
  }
};
