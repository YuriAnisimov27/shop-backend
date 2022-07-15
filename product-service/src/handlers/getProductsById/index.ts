import { APIGatewayProxyEvent } from 'aws-lambda';

import { productsList } from '../../data/productsList';
import {
  buildResponseFailure,
  buildSuccessResponse,
  LambdaResponseSerialized,
} from '../../utils/responses';

export const getProductsById = async (
  event: APIGatewayProxyEvent
): Promise<LambdaResponseSerialized> => {
  try {
    if (event.pathParameters && event.pathParameters.id) {
      const { id } = event.pathParameters;
      const product = productsList.find(el => el.id === id);

      if (product) {
        return buildSuccessResponse(product);
      } else {
        return buildResponseFailure(404, 'Product not found');
      }
    }

    return buildResponseFailure(404, 'Product not found');
  } catch (err) {
    return buildResponseFailure(500, err);
  }
};
