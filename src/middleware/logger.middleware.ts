import { Request, Response, NextFunction } from 'express';

// Logger middleware to log request details
export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const start = Date.now();
  
  // Log request details
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  console.log(`Request Body:`, req.body);
  console.log(`Request Query:`, req.query);
  console.log(`Request Params:`, req.params);
  
  // Log response details after the response is sent
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} ${res.statusCode} - ${duration}ms`);
  });
  
  next();
};
