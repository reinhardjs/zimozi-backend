import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import Task, { TaskStatus } from '../models/Task';
import { setCache, getCache, deleteCache, deleteCachePattern } from '../utils/redis';

// Create a new task
export const createTask = async (req: Request, res: Response): Promise<void> => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { title, description, status, dueDate, assignedTo } = req.body;

    // Create new task
    const task = await Task.create({
      title,
      description,
      status: status || TaskStatus.TODO,
      dueDate,
      assignedTo,
    });

    // Invalidate cache for tasks list
    await deleteCachePattern('tasks:*');

    res.status(201).json(task);
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get task by ID
export const getTaskById = async (req: Request, res: Response): Promise<void> => {
  try {
    const taskId = req.params.id;
    
    // Try to get task from cache
    const cachedTask = await getCache(`task:${taskId}`);
    if (cachedTask) {
      res.json(cachedTask);
      return;
    }

    // Find task by ID
    const task = await Task.findById(taskId).populate('assignedTo', 'name email');
    
    if (!task) {
      res.status(404).json({ message: 'Task not found' });
      return;
    }

    // Cache task for 1 minute
    await setCache(`task:${taskId}`, task, 60);

    res.json(task);
  } catch (error) {
    console.error('Get task error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all tasks with optional filters
export const getAllTasks = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status, dueDate, assignedTo } = req.query;
    
    // Build filter object
    const filter: any = {};
    if (status) filter.status = status;
    if (assignedTo) filter.assignedTo = assignedTo;
    if (dueDate) {
      const date = new Date(dueDate as string);
      filter.dueDate = {
        $gte: new Date(date.setHours(0, 0, 0, 0)),
        $lt: new Date(date.setHours(23, 59, 59, 999)),
      };
    }
    
    // Create cache key based on filters
    const cacheKey = `tasks:${JSON.stringify(filter)}`;
    
    // Try to get tasks from cache
    const cachedTasks = await getCache(cacheKey);
    if (cachedTasks) {
      res.json(cachedTasks);
      return;
    }

    // Find tasks with filters
    const tasks = await Task.find(filter)
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 });

    // Cache tasks for 1 minute
    await setCache(cacheKey, tasks, 60);

    res.json(tasks);
  } catch (error) {
    console.error('Get all tasks error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update task
export const updateTask = async (req: Request, res: Response): Promise<void> => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const taskId = req.params.id;
    const { title, description, status, dueDate, assignedTo } = req.body;

    // Find task by ID
    let task = await Task.findById(taskId);
    
    if (!task) {
      res.status(404).json({ message: 'Task not found' });
      return;
    }

    // Update task
    task = await Task.findByIdAndUpdate(
      taskId,
      {
        title,
        description,
        status,
        dueDate,
        assignedTo,
      },
      { new: true, runValidators: true }
    ).populate('assignedTo', 'name email');

    // Invalidate cache
    await deleteCache(`task:${taskId}`);
    await deleteCachePattern('tasks:*');

    res.json(task);
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete task
export const deleteTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const taskId = req.params.id;

    // Find task by ID and delete
    const task = await Task.findByIdAndDelete(taskId);
    
    if (!task) {
      res.status(404).json({ message: 'Task not found' });
      return;
    }

    // Invalidate cache
    await deleteCache(`task:${taskId}`);
    await deleteCachePattern('tasks:*');

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
