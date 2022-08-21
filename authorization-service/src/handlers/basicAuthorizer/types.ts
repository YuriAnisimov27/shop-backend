import { APIGatewayEvent } from 'aws-lambda';

export interface AuthorizerEvent extends APIGatewayEvent {
  type: 'TOKEN';
  authorizationToken: string;
  methodArn: string;
}
