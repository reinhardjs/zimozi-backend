import express from 'express';
import {
  createTask,
  getTaskById,
  getAllTasks,
  updateTask,
  deleteTask,
} from '../controllers/task.controller';
import {
  createTaskValidation,
  updateTaskValidation,
} from '../middleware/validation.middleware';
import { authenticate, isAdmin } from '../middleware/auth.middleware';

const router = express.Router();

// All routes are protected with authentication
router.use(authenticate);

// Create a new task
router.post('/', createTaskValidation, createTask);

// Get task by ID
router.get('/:id', getTaskById);

// Get all tasks with optional filters
router.get('/', getAllTasks);

// Update task
router.put('/:id', updateTaskValidation, updateTask);

// Delete task (admin only)
router.delete('/:id', isAdmin, deleteTask);

export default router;
