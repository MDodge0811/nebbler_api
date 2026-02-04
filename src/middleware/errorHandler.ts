import type { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import { logger } from '../utils/logger.js';
import { env } from '../config/env.js';

export class AppError extends Error {
  constructor(
    public statusCode: number,
    public override message: string,
    public isOperational = true
  ) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler: ErrorRequestHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  const statusCode = err instanceof AppError ? err.statusCode : 500;
  const isOperational = err instanceof AppError ? err.isOperational : false;

  // Log the error with context
  logger.error(
    {
      err,
      statusCode,
      isOperational,
      method: req.method,
      url: req.url,
      requestId: req.headers['x-request-id'],
    },
    'Request error'
  );

  // Send response
  res.status(statusCode).json({
    status: 'error',
    statusCode,
    message: isOperational ? err.message : 'Internal server error',
    ...(env.NODE_ENV === 'development' && {
      stack: err.stack,
    }),
  });
};

// Handle unhandled promise rejections and uncaught exceptions
export const setupGlobalErrorHandlers = (): void => {
  process.on('uncaughtException', (error) => {
    logger.fatal({ error }, 'Uncaught exception');
    process.exit(1);
  });

  process.on('unhandledRejection', (reason, promise) => {
    logger.fatal({ reason, promise }, 'Unhandled rejection');
    process.exit(1);
  });
};
