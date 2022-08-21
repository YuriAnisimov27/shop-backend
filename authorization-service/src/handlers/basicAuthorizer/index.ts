import { Context, APIGatewayProxyResult, Callback } from 'aws-lambda';

import { logger } from 'src/utils/logger';
import { generatePolicy } from './helpers';
import { AuthorizerEvent } from './types';

export const basicAuthorizer = async (
  event: AuthorizerEvent,
  context: Context,
  callback: Callback
): Promise<APIGatewayProxyResult | void> => {
  logger.info(`basicAuthorizer event: ${JSON.stringify(event)}`);

  if (event.type !== 'TOKEN') {
    callback('Unauthorized');
  }

  try {
    const encodedCreds = event.authorizationToken.split(' ')[1];
    const buff = Buffer.from(encodedCreds, 'base64');
    const [username, password] = buff.toString('utf-8').split(':');

    logger.info(`Got username: ${username}, password: ${password}`);

    const storedUserPassword = process.env[username];
    const effect =
      !storedUserPassword || storedUserPassword !== password ? 'Deny' : 'Allow';

    const policy = generatePolicy(encodedCreds, event.methodArn, effect);
    callback(null, policy);
  } catch (err) {
    const error = err as Error;
    logger.error(`basicAuthorizer error: ${error.message}`);
    callback(`Unauthorized: ${error.message}`);
  }
};
