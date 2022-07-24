import { Pool, PoolClient } from 'pg';

import { logger } from 'src/utils/logger';
import { dbOptions } from '../../utils/dbConnection';
import {
  buildResponseFailure,
  buildSuccessResponse,
  LambdaResponseSerialized,
} from '../../utils/responses';

let pool: Pool;

export const getProductsList = async (): Promise<LambdaResponseSerialized> => {
  if (!pool) {
    pool = new Pool(dbOptions);
    logger.info('new Pool created');
  }

  const client = (await pool.connect().catch((err: Error) => {
    logger.error(`Error connecting to database: ${err.message}`);
    return buildResponseFailure(500, err);
  })) as PoolClient;
  logger.info('Connected to database');

  try {
    const { rows: products } = await client.query(`
      select products.id, products.title, products.description, products.imgUrl,
      products.price, stocks.product_count AS "count"
      from products join stocks on products.id=stocks.product_id
    `);

    logger.info(`Products: ${JSON.stringify(products)}`);
    return buildSuccessResponse(products);
  } catch (err) {
    logger.error(`Error querying database: ${err}`);
    return buildResponseFailure(500, err);
  } finally {
    logger.info('Closing database connection...');
    client.release();
  }
};
