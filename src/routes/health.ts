import { Router } from 'express';
import { pool } from '../config/database.js';
import { AppError } from '../middleware/errorHandler.js';

export const healthRouter = Router();

// Basic health check
healthRouter.get('/', (_req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
  });
});

// Database health check
healthRouter.get('/db', async (_req, res, next) => {
  try {
    const result = await pool.query('SELECT NOW()');
    const serverTime = result.rows[0]?.now as Date | undefined;

    res.json({
      status: 'healthy',
      database: 'connected',
      serverTime: serverTime?.toISOString(),
      timestamp: new Date().toISOString(),
    });
  } catch (_error) {
    next(new AppError(503, 'Database connection failed'));
  }
});
