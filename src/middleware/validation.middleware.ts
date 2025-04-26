import { body } from 'express-validator';
import { TaskStatus } from '../models/Task';

// Validation for user registration
export const registerValidation = [
  body('name')
    .notEmpty()
    .withMessage('Name is required')
    .trim()
    .isLength({ min: 2 })
    .withMessage('Name must be at least 2 characters long'),
  body('email')
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('role')
    .optional()
    .isIn(['user', 'admin'])
    .withMessage('Role must be either user or admin'),
];

// Validation for user login
export const loginValidation = [
  body('email')
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
];

// Validation for creating a task
export const createTaskValidation = [
  body('title')
    .notEmpty()
    .withMessage('Title is required')
    .trim()
    .isLength({ min: 3 })
    .withMessage('Title must be at least 3 characters long'),
  body('description')
    .notEmpty()
    .withMessage('Description is required')
    .trim(),
  body('status')
    .optional()
    .isIn(Object.values(TaskStatus))
    .withMessage(`Status must be one of: ${Object.values(TaskStatus).join(', ')}`),
  body('dueDate')
    .notEmpty()
    .withMessage('Due date is required')
    .isISO8601()
    .withMessage('Due date must be a valid date')
    .toDate(),
  body('assignedTo')
    .notEmpty()
    .withMessage('AssignedTo is required')
    .isMongoId()
    .withMessage('AssignedTo must be a valid MongoDB ID'),
];

// Validation for updating a task
export const updateTaskValidation = [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 3 })
    .withMessage('Title must be at least 3 characters long'),
  body('description')
    .optional()
    .trim(),
  body('status')
    .optional()
    .isIn(Object.values(TaskStatus))
    .withMessage(`Status must be one of: ${Object.values(TaskStatus).join(', ')}`),
  body('dueDate')
    .optional()
    .isISO8601()
    .withMessage('Due date must be a valid date')
    .toDate(),
  body('assignedTo')
    .optional()
    .isMongoId()
    .withMessage('AssignedTo must be a valid MongoDB ID'),
];
