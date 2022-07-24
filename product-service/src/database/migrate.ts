import { migrate } from 'postgres-migrations';
import pg, { ClientConfig } from 'pg';
import dotenv from 'dotenv';

dotenv.config();
const { PG_HOST, PG_PORT, PG_DATABASE, PG_USERNAME, PG_PASSWORD } = process.env;
const dbOptions = {
  host: PG_HOST,
  port: PG_PORT,
  database: PG_DATABASE,
  user: PG_USERNAME,
  password: PG_PASSWORD,
  ssl: {
    rejectUnauthorized: false,
  },
  connectionTimeoutMillis: 5000,
} as unknown as ClientConfig;

export const migration = async (): Promise<void> => {
  const client = new pg.Client(dbOptions);
  await client.connect();

  try {
    await migrate({ client }, './migration.sql');
  } finally {
    await client.end();
  }
};
