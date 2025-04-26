import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { authenticate, isAdmin } from '../../middleware/auth.middleware';
import User, { UserRole } from '../../models/User';
import config from '../../config/config';

// Mock User model
jest.mock('../../models/User');

describe('Auth Middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: jest.Mock;

  beforeEach(() => {
    mockRequest = {
      headers: {},
      user: undefined,
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    nextFunction = jest.fn();
  });

  describe('authenticate', () => {
    it('should return 401 if no token is provided', async () => {
      await authenticate(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Authentication required. No token provided.',
      });
      expect(nextFunction).not.toHaveBeenCalled();
    });

    it('should return 401 if token is invalid', async () => {
      mockRequest.headers = {
        authorization: 'Bearer invalid_token',
      };

      await authenticate(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Invalid token',
      });
      expect(nextFunction).not.toHaveBeenCalled();
    });

    it('should set user in request and call next if token is valid', async () => {
      // Create a valid user
      const userId = new mongoose.Types.ObjectId();
      const user = {
        _id: userId,
        name: 'Test User',
        email: 'test@example.com',
        role: UserRole.USER,
      };

      // Create a valid token
      const token = jwt.sign({ id: userId }, config.jwtSecret);
      mockRequest.headers = {
        authorization: `Bearer ${token}`,
      };

      // Mock User.findById to return a user
      (User.findById as jest.Mock).mockImplementationOnce(() => ({
        select: jest.fn().mockResolvedValueOnce(user),
      }));

      await authenticate(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(mockRequest.user).toEqual(user);
      expect(nextFunction).toHaveBeenCalled();
      expect(mockResponse.status).not.toHaveBeenCalled();
      expect(mockResponse.json).not.toHaveBeenCalled();
    });
  });

  describe('isAdmin', () => {
    it('should return 403 if user is not admin', () => {
      mockRequest.user = {
        _id: new mongoose.Types.ObjectId(),
        name: 'Regular User',
        email: 'user@example.com',
        role: UserRole.USER,
      };

      isAdmin(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(mockResponse.status).toHaveBeenCalledWith(403);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Access denied. Admin role required.',
      });
      expect(nextFunction).not.toHaveBeenCalled();
    });

    it('should call next if user is admin', () => {
      mockRequest.user = {
        _id: new mongoose.Types.ObjectId(),
        name: 'Admin User',
        email: 'admin@example.com',
        role: UserRole.ADMIN,
      };

      isAdmin(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(nextFunction).toHaveBeenCalled();
      expect(mockResponse.status).not.toHaveBeenCalled();
      expect(mockResponse.json).not.toHaveBeenCalled();
    });
  });
});
