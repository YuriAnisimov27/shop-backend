import { productsList } from '../../data/productsList';
import {
  buildResponseFailure,
  buildSuccessResponse,
  LambdaResponseSerialized,
} from '../../utils/responses';

export const getProductsList = async (): Promise<LambdaResponseSerialized> => {
  try {
    const products = productsList;

    return buildSuccessResponse(products);
  } catch (err) {
    return buildResponseFailure(500, err);
  }
};
