import pino, { type LoggerOptions } from 'pino';
import { env } from '../config/env.js';

const getLoggerOptions = (): LoggerOptions => {
  const baseOptions: LoggerOptions = {
    level: env.LOG_LEVEL,
    base: {
      env: env.NODE_ENV,
    },
    timestamp: pino.stdTimeFunctions.isoTime,
    formatters: {
      level: (label) => ({ level: label }),
    },
  };

  if (env.NODE_ENV === 'development') {
    return {
      ...baseOptions,
      transport: {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'HH:MM:ss Z',
          ignore: 'pid,hostname',
        },
      },
    };
  }

  return baseOptions;
};

export const logger = pino(getLoggerOptions());

export const createChildLogger = (context: Record<string, unknown>) => {
  return logger.child(context);
};
