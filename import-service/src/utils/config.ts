import dotenv from 'dotenv';

dotenv.config();
const { BUCKET, SQS_URL } = process.env;

export const config = {
  BUCKET,
  SQS_URL,
};
