import { createApp } from './app.js';
import { env } from './config/env.js';
import { logger } from './utils/logger.js';
import { checkDatabaseConnection, closePool } from './config/database.js';
import { setupGlobalErrorHandlers } from './middleware/errorHandler.js';

const startServer = async () => {
  setupGlobalErrorHandlers();

  // Verify database connection
  const dbConnected = await checkDatabaseConnection();
  if (!dbConnected) {
    logger.fatal('Failed to connect to database. Exiting...');
    process.exit(1);
  }

  const app = createApp();

  const server = app.listen(env.PORT, env.HOST, () => {
    logger.info({ host: env.HOST, port: env.PORT }, 'Server started');
  });

  // Graceful shutdown
  const shutdown = async (signal: string) => {
    logger.info({ signal }, 'Shutdown signal received');

    server.close(async () => {
      logger.info('HTTP server closed');
      await closePool();
      process.exit(0);
    });

    // Force shutdown after 10 seconds
    setTimeout(() => {
      logger.error('Forced shutdown due to timeout');
      process.exit(1);
    }, 10000);
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
};

startServer().catch((error) => {
  logger.fatal({ error }, 'Failed to start server');
  process.exit(1);
});
