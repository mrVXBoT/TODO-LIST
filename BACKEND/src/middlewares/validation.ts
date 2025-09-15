import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import { createApiResponse } from '../utils/auth';

export const validateRequest = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json(
      createApiResponse(false, 'Validation failed', undefined, errors.array().map(err => err.msg).join(', '))
    );
    return;
  }
  next();
};

// User validation rules
export const validateUserRegistration = [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('name').trim().notEmpty().withMessage('Name is required'),
  validateRequest,
];

export const validateUserLogin = [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required'),
  validateRequest,
];

// Task validation rules
export const validateTaskCreate = [
  body('title').trim().notEmpty().withMessage('Task title is required'),
  body('priority').isIn(['LOW', 'MEDIUM', 'HIGH']).withMessage('Priority must be LOW, MEDIUM, or HIGH'),
  body('dueDate').optional().isISO8601().withMessage('Due date must be a valid date'),
  body('description').optional().isLength({ max: 1000 }).withMessage('Description must be less than 1000 characters'),
  validateRequest,
];

export const validateTaskUpdate = [
  body('title').optional().trim().notEmpty().withMessage('Task title cannot be empty'),
  body('priority').optional().isIn(['LOW', 'MEDIUM', 'HIGH']).withMessage('Priority must be LOW, MEDIUM, or HIGH'),
  body('dueDate').optional().isISO8601().withMessage('Due date must be a valid date'),
  body('description').optional().isLength({ max: 1000 }).withMessage('Description must be less than 1000 characters'),
  body('isCompleted').optional().isBoolean().withMessage('isCompleted must be a boolean'),
  validateRequest,
];

// Note validation rules
export const validateNoteTopicCreate = [
  body('topic').trim().notEmpty().withMessage('Note topic is required'),
  validateRequest,
];

export const validateNoteEntryCreate = [
  body('content').trim().notEmpty().withMessage('Note content is required'),
  validateRequest,
];

// Profile validation rules
export const validateProfileUpdate = [
  body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
  body('habits').optional().isLength({ max: 2000 }).withMessage('Habits must be less than 2000 characters'),
  validateRequest,
];
