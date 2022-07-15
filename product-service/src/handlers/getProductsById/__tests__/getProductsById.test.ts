import { APIGatewayProxyEvent } from 'aws-lambda';

import { getProductsById } from '..';
import { Item } from '../../types';

const expectedItem: Item = {
  count: 4,
  id: '1',
  title: 'Diavel',
  description: 'Short Product Description',
  price: 21300,
  imgUrl:
    'https://images.ctfassets.net/x7j9qwvpvr5s/605GXZE7lqLUCPXAy21OMl/3e4377b0a8a557c7fb8f03992e10d29d/Model-Menu-MY21-DVL-1260-Bk-v04.png',
};

describe('getProductsById', async () => {
  it('should return product by id', async () => {
    const event = {
      pathParameters: {
        id: '1',
      },
    } as unknown as APIGatewayProxyEvent;

    const { body, statusCode } = await getProductsById(event);

    expect(body).toEqual(JSON.stringify(expectedItem));
    expect(statusCode).toBe(200);
  });

  it('should return error when product not found', async () => {
    const event = {
      pathParameters: {
        id: '42',
      },
    } as unknown as APIGatewayProxyEvent;

    const { body, statusCode } = await getProductsById(event);

    expect(body).toEqual(JSON.stringify('Product not found'));
    expect(statusCode).toBe(404);
  });
});
