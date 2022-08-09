import AWSMock from 'aws-sdk-mock';
import AWS from 'aws-sdk';
import { APIGatewayProxyEvent } from 'aws-lambda';

import { importProductsFile } from '../index';

const file = 'file.csv';
const mockUrl = `https://s3.com/uploaded/${file}`;
const event = {
  queryStringParameters: {
    name: file,
  },
} as unknown as APIGatewayProxyEvent;

describe('importProductsFile', () => {
  afterEach(() => {
    AWSMock.restore();
  });

  it('should return correct signedUrl', async () => {
    AWSMock.setSDKInstance(AWS);
    AWSMock.mock('S3', 'getSignedUrl', mockUrl);

    const { body, statusCode } = await importProductsFile(event);
    const parsedBody = typeof body === 'string' ? JSON.parse(body) : body;

    expect(parsedBody).toEqual({ signedUrl: mockUrl });
    expect(statusCode).toBe(200);
  });

  it('should return error if no file name provided', async () => {
    AWSMock.setSDKInstance(AWS);
    AWSMock.mock('S3', 'getSignedUrl', mockUrl);

    const { body, statusCode } = await importProductsFile(
      {} as APIGatewayProxyEvent
    );
    const parsedBody = typeof body === 'string' ? JSON.parse(body) : body;

    expect(parsedBody).toBe('File not found');
    expect(statusCode).toBe(404);
  });

  it('should return 500 if error', async () => {
    AWSMock.setSDKInstance(AWS);
    AWSMock.mock('S3', 'getSignedUrl', () => {
      throw new Error('Internal Error');
    });

    const { body } = await importProductsFile(event);
    const parsedBody = typeof body === 'string' ? JSON.parse(body) : body;

    expect(JSON.parse(parsedBody.signedUrl.body)).toBe('Internal Error');
    expect(JSON.parse(parsedBody.signedUrl.statusCode)).toBe(500);
  });
});
