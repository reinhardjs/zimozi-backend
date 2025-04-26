import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { createTask, getTaskById, getAllTasks, updateTask, deleteTask } from '../../controllers/task.controller';
import Task, { TaskStatus } from '../../models/Task';
import * as redisUtils from '../../utils/redis';

// Mock Task model and Redis utils
jest.mock('../../models/Task');
jest.mock('../../utils/redis');
jest.mock('express-validator', () => ({
  validationResult: jest.fn().mockReturnValue({ isEmpty: () => true }),
}));

describe('Task Controller', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  const userId = new mongoose.Types.ObjectId();
  const taskId = new mongoose.Types.ObjectId();

  beforeEach(() => {
    mockRequest = {
      params: { id: taskId.toString() },
      body: {},
      query: {},
      user: { _id: userId },
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.clearAllMocks();
  });

  describe('createTask', () => {
    it('should create a task successfully', async () => {
      const taskData = {
        title: 'Test Task',
        description: 'Test Description',
        status: TaskStatus.TODO,
        dueDate: new Date(),
        assignedTo: userId,
      };
      mockRequest.body = taskData;

      const createdTask = { _id: taskId, ...taskData };
      (Task.create as jest.Mock).mockResolvedValueOnce(createdTask);

      await createTask(mockRequest as Request, mockResponse as Response);

      expect(Task.create).toHaveBeenCalledWith(taskData);
      expect(redisUtils.deleteCachePattern).toHaveBeenCalledWith('tasks:*');
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith(createdTask);
    });
  });

  describe('getTaskById', () => {
    it('should return task from cache if available', async () => {
      const cachedTask = {
        _id: taskId,
        title: 'Cached Task',
        description: 'Cached Description',
      };
      (redisUtils.getCache as jest.Mock).mockResolvedValueOnce(cachedTask);

      await getTaskById(mockRequest as Request, mockResponse as Response);

      expect(redisUtils.getCache).toHaveBeenCalledWith(`task:${taskId}`);
      expect(Task.findById).not.toHaveBeenCalled();
      expect(mockResponse.json).toHaveBeenCalledWith(cachedTask);
    });

    it('should fetch task from database and cache it if not in cache', async () => {
      const task = {
        _id: taskId,
        title: 'Test Task',
        description: 'Test Description',
      };
      (redisUtils.getCache as jest.Mock).mockResolvedValueOnce(null);
      (Task.findById as jest.Mock).mockReturnValueOnce({
        populate: jest.fn().mockResolvedValueOnce(task),
      });

      await getTaskById(mockRequest as Request, mockResponse as Response);

      expect(redisUtils.getCache).toHaveBeenCalledWith(`task:${taskId}`);
      expect(Task.findById).toHaveBeenCalledWith(taskId.toString());
      expect(redisUtils.setCache).toHaveBeenCalledWith(`task:${taskId}`, task, 60);
      expect(mockResponse.json).toHaveBeenCalledWith(task);
    });

    it('should return 404 if task not found', async () => {
      (redisUtils.getCache as jest.Mock).mockResolvedValueOnce(null);
      (Task.findById as jest.Mock).mockReturnValueOnce({
        populate: jest.fn().mockResolvedValueOnce(null),
      });

      await getTaskById(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Task not found' });
    });
  });

  // Additional tests for getAllTasks, updateTask, and deleteTask would follow a similar pattern
});
