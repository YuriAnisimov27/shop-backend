import { SQSEvent } from 'aws-lambda';
import { SNS } from 'aws-sdk';
import { Client } from 'pg';
import { v4 } from 'uuid';

import { logger } from '../../utils/logger';
import {
  buildResponseFailure,
  buildSuccessResponse,
  LambdaResponseSerialized,
} from '../../utils/responses';
import { validation } from '../../utils/validation';
import { dbOptions } from '../../utils/dbConnection';

export const catalogBatchProcess = async (
  event: SQSEvent
): Promise<LambdaResponseSerialized> => {
  const client = new Client(dbOptions);
  await client.connect();
  logger.info('Connected to database');

  try {
    if (!event.Records) {
      logger.error('No records provided');
      return buildResponseFailure(400, 'Bad request: event.Records is empty');
    }

    const records = event.Records.map((record) => JSON.parse(record.body));
    let snsPublishResponse;
    for (const record of records) {
      logger.info(`Processing record: ${record}`);
      const { title, description, price, count, imgUrl } = record;
      logger.info(
        `Creating product: title: ${title}, description: ${description}, price: ${price}, imgUrl: ${imgUrl}, count: ${count}`
      );

      const data = validation(title, description, +price, imgUrl, +count);

      if (data instanceof Error) {
        logger.error(`Error validating product: ${data.message}`);
        return buildResponseFailure(400, `Validation error: ${data.message}`);
      }

      const id = v4();

      await client.query('BEGIN');
      logger.info('Transaction started');

      await client.query(
        `
    	insert into products (id, title, description, price, imgUrl)
    	values (
        '${id}',
        '${data.title}',
        '${data.description}',
        ${+data.price},
        '${data.imgUrl}'
    	)
    `
      );
      logger.info('Product inserted');

      await client.query(
        `
    	insert into stocks (product_id, product_count) values
    	('${id}', ${+data.count})
    `
      );
      logger.info('Stock inserted');

      await client.query('COMMIT');
      logger.info('Transaction committed');

      const sns = new SNS({ region: 'us-east-1' });

      const params = {
        Subject: `New product added: ${title}`,
        Message: `${JSON.stringify(record)}`,
        TopicArn: process.env.SNS_ARN,
        MessageAttributes: {
          count: {
            DataType: 'String',
            StringValue: +data.count > 99 ? 'hugeImport' : 'smallImport',
          },
        },
      };

      snsPublishResponse = await sns.publish(params).promise();
    }

    return buildSuccessResponse(snsPublishResponse as object);
  } catch (e) {
    const error = e as Error;
    await client.query('ROLLBACK');
    logger.error(`Internal Error: ${error.message}`);
    return buildResponseFailure(500, error.message);
  } finally {
    client.end();
    logger.info('Disconnected from database');
  }
};
