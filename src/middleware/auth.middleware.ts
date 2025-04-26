import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config/config';
import User, { UserRole } from '../models/User';

// Extend Express Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

// Interface for JWT payload
interface JwtPayload {
  id: string;
}

// Middleware to authenticate JWT token
export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ message: 'Authentication required. No token provided.' });
      return;
    }

    // Get token
    const token = authHeader.split(' ')[1];

    // Verify token
    const decoded = jwt.verify(token, config.jwtSecret) as JwtPayload;

    // Find user by id
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      res.status(401).json({ message: 'User not found' });
      return;
    }

    // Set user to req object
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Middleware to check if user is admin
export const isAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (req.user && req.user.role === UserRole.ADMIN) {
    next();
  } else {
    res.status(403).json({ message: 'Access denied. Admin role required.' });
  }
};
