import pg from 'pg';
import { env } from './env.js';
import { logger } from '../utils/logger.js';

const { Pool } = pg;

// Support both DATABASE_URL (hosted) and individual params (local)
const getPoolConfig = (): pg.PoolConfig => {
  if (env.DATABASE_URL) {
    logger.info('Using DATABASE_URL for database connection');
    return {
      connectionString: env.DATABASE_URL,
      ssl: env.DB_SSL ? { rejectUnauthorized: false } : false,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
    };
  }

  logger.info({ host: env.DB_HOST, database: env.DB_NAME }, 'Using individual params for database connection');
  return {
    host: env.DB_HOST,
    port: env.DB_PORT,
    user: env.DB_USER,
    password: env.DB_PASSWORD,
    database: env.DB_NAME,
    ssl: env.DB_SSL ? { rejectUnauthorized: false } : false,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
  };
};

export const pool = new Pool(getPoolConfig());

// Connection event handlers
pool.on('connect', () => {
  logger.debug('New database connection established');
});

pool.on('error', (err) => {
  logger.error({ err }, 'Unexpected database pool error');
});

// Graceful shutdown helper
export const closePool = async (): Promise<void> => {
  logger.info('Closing database pool...');
  await pool.end();
  logger.info('Database pool closed');
};

// Health check query
export const checkDatabaseConnection = async (): Promise<boolean> => {
  try {
    const result = await pool.query('SELECT NOW()');
    const serverTime = result.rows[0]?.now as Date | undefined;
    logger.info({ serverTime }, 'Database connection verified');
    return true;
  } catch (error) {
    logger.error({ error }, 'Database connection failed');
    return false;
  }
};
