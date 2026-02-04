import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { requestLogger } from './middleware/requestLogger.js';
import { errorHandler } from './middleware/errorHandler.js';
import { healthRouter } from './routes/health.js';

export const createApp = () => {
  const app = express();

  // Security middleware
  app.use(helmet());
  app.use(cors());

  // Body parsing
  app.use(express.json({ limit: '10kb' }));
  app.use(express.urlencoded({ extended: true, limit: '10kb' }));

  // Request logging
  app.use(requestLogger);

  // Routes
  app.use('/health', healthRouter);

  // 404 handler
  app.use((_req, res) => {
    res.status(404).json({ status: 'error', message: 'Not found' });
  });

  // Error handler (must be last)
  app.use(errorHandler);

  return app;
};
