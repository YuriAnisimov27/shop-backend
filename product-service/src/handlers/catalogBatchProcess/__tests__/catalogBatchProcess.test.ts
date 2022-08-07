import AWSMock from 'aws-sdk-mock';
import AWS from 'aws-sdk';
import { SQSEvent } from 'aws-lambda';

import { catalogBatchProcess } from '..';

jest.mock('pg', () => {
  const mClient = {
    connect: jest.fn(),
    query: jest.fn(),
    end: jest.fn(),
  };
  return { Client: jest.fn(() => mClient) };
});

const snsPublishMock = jest.fn();

describe('catalogBatchProcess', () => {
  beforeAll(async () => {
    AWSMock.setSDKInstance(AWS);
    AWSMock.mock('SNS', 'publish', (params) => {
      snsPublishMock(params);
    });
  });

  afterAll(() => {
    AWSMock.restore('SNS');
    jest.clearAllMocks();
  });

  it('should return 400 error if no records provided', async () => {
    const event = {} as SQSEvent;
    const result = await catalogBatchProcess(event);

    expect(result.statusCode).toBe(400);
    expect(snsPublishMock).not.toHaveBeenCalled();
  });

  it('should return a success response', async () => {
    const event = {
      Records: [
        {
          body: JSON.stringify({
            title: 'test',
            description: 'test',
            price: 1,
            imgUrl: 'test',
            count: 1,
          }),
        },
      ],
    } as SQSEvent;

    const result = await catalogBatchProcess(event);

    expect(result.statusCode).toBe(200);
    expect(snsPublishMock).toHaveBeenCalled();
  });

  it('should handle internal error', async () => {
    AWSMock.mock('SNS', 'publish', () => {
      throw new Error('Internal error');
    });

    const event = {
      Records: [
        {
          body: JSON.stringify({
            title: 'test',
            description: 'test',
            price: 1,
            imgUrl: 'test',
            count: 1,
          }),
        },
      ],
    } as SQSEvent;

    const result = await catalogBatchProcess(event);

    expect(result.statusCode).toBe(500);
    expect(snsPublishMock).not.toHaveBeenCalled();
  });
});
