import { Request, Response, NextFunction } from 'express';

// Interface for custom error with status code
export interface CustomError extends Error {
  statusCode?: number;
}

// Error handling middleware
export const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const statusCode = err.statusCode || 500;
  
  res.status(statusCode).json({
    message: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
  });
};

// Not found middleware
export const notFound = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const error = new Error(`Not Found - ${req.originalUrl}`) as CustomError;
  error.statusCode = 404;
  next(error);
};
