import { APIGatewayProxyEvent } from 'aws-lambda';
import { Client } from 'pg';

import { logger } from 'src/utils/logger';
import { dbOptions } from '../../utils/dbConnection';
import {
  buildResponseFailure,
  buildSuccessResponse,
  LambdaResponseSerialized,
} from '../../utils/responses';

export const getProductsById = async (
  event: APIGatewayProxyEvent
): Promise<LambdaResponseSerialized> => {
  const client = new Client(dbOptions);
  logger.info('Connected to database');

  try {
    await client.connect();
    logger.info('Getting product by ID...');

    if (event.pathParameters && event.pathParameters.id) {
      const { id } = event.pathParameters;
      const { rows: product } = await client.query(`
      select products.id, products.title, products.description, products.price, stocks.product_count AS "count"
      from products join stocks on products.id=stocks.product_id
      where products.id='${id}' ;
    `);

      if (product) {
        logger.info(`Product found: ${JSON.stringify(product)}`);
        return buildSuccessResponse(product);
      } else {
        logger.error(`Product not found: ${id}`);
        return buildResponseFailure(404, 'Product not found');
      }
    }

    logger.error('No product id provided');
    return buildResponseFailure(404, 'Product not found');
  } catch (err) {
    logger.error(`Error querying database: ${err}`);
    return buildResponseFailure(500, err);
  } finally {
    logger.info('Closing database connection...');
    client.end();
  }
};
