import { APIGatewayEvent } from 'aws-lambda';
import { Pool } from 'pg';
import { v4 } from 'uuid';

import { logger } from 'src/utils/logger';
import { dbOptions } from 'src/utils/dbConnection';
import {
  buildResponseFailure,
  buildSuccessResponse,
  LambdaResponseSerialized,
} from 'src/utils/responses';
import { validation } from 'src/utils/validation';

const pool = new Pool(dbOptions);

export const createProduct = async (
  event: APIGatewayEvent
): Promise<LambdaResponseSerialized> => {
  if (!event.body) {
    logger.error('No product data provided');
    return buildResponseFailure(400, 'Bad request: event.body is empty');
  }

  const { title, description, price, imgUrl, count } = JSON.parse(event.body);
  logger.info(
    `Creating product: title: ${title}, description: ${description}, price: ${price}, imgUrl: ${imgUrl}, count: ${count}`
  );

  const data = validation(title, description, price, imgUrl, count);
  if (data instanceof Error) {
    logger.error(`Error validating product: ${data.message}`);
    return buildResponseFailure(400, `Validation error: ${data.message}`);
  }

  const id = v4();
  const client = await pool.connect();
  logger.info('Connected to database');

  await client.connect();

  try {
    await client.query('BEGIN').then(() => logger.info('Transaction started'));

    await client
      .query(
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
      )
      .then(() => logger.info('Product inserted'))
      .catch((err) => logger.error(`Error inserting product: ${err}`));

    await client
      .query(
        `
    	insert into stocks (product_id, product_count) values
    	('${id}', ${+data.count})
    `
      )
      .then(() => logger.info('Stock inserted'))
      .catch((err) => logger.error(`Error inserting stock: ${err}`));

    await client
      .query('COMMIT')
      .then(() => logger.info('Transaction committed'));

    return buildSuccessResponse(
      {
        id,
        title,
        description,
        price,
        imgUrl,
        count,
      },
      201
    );
  } catch (err) {
    logger.error(`Error querying database: ${err}`);
    await client.query('ROLLBACK');
    return buildResponseFailure(500, err);
  } finally {
    logger.info('Closing connection');
    client.release();
  }
};
