import { getProductsList } from '..';
import { productsList } from '../../../data/productsList';

describe('get all products', async () => {
  it('should return all the products', async () => {
    const { body, statusCode } = await getProductsList();

    expect(body).toEqual(JSON.stringify(productsList));
    expect(statusCode).toBe(200);
  });
});
