export interface LambdaResponseSerialized {
  statusCode: 200 | 201 | 400 | 403 | 404 | 500;
  body: object | string;
  headers?: Record<string, string | boolean>;
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': '*',
  'Access-Control-Allow-Credentials': true,
  'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
};

export const buildSuccessResponse = (
  body: object,
  statusCode: LambdaResponseSerialized['statusCode'] = 200,
  headers?: Record<string, string>
): LambdaResponseSerialized => ({
  statusCode,
  body: JSON.stringify(body),
  headers: {
    ...headers,
    ...corsHeaders,
  },
});

export const buildResponseFailure = <T>(
  statusCode: 400 | 403 | 404 | 500,
  body: T,
  headers?: Record<string, string>
): LambdaResponseSerialized => {
  const serializedBody = JSON.stringify(body);
  return {
    statusCode,
    body: serializedBody,
    headers: {
      ...headers,
      ...corsHeaders,
    },
  };
};
