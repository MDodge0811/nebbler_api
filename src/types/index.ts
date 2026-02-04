// Shared TypeScript types for the application

export interface ApiResponse<T = unknown> {
  status: 'success' | 'error';
  data?: T;
  message?: string;
}

export interface HealthResponse {
  status: 'healthy' | 'unhealthy';
  timestamp: string;
  database?: 'connected' | 'disconnected';
  serverTime?: string;
}

export interface ErrorResponse {
  status: 'error';
  statusCode: number;
  message: string;
  stack?: string;
}
