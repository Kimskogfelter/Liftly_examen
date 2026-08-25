import { Router } from 'express';
import { createWorkout, getWorkouts, getWorkout, updateWorkout, deleteWorkout } from '../controllers/workoutController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

export const workoutRouter = Router();

// Subroutes for Workout (protected with authMiddleware)
workoutRouter.post('/create', authMiddleware, createWorkout);
workoutRouter.get('/user', authMiddleware, getWorkouts); // fetch all workout for a logged in user
workoutRouter.get('/:workoutId', authMiddleware, getWorkout);
workoutRouter.patch('/:workoutId/update', authMiddleware, updateWorkout);
workoutRouter.delete('/:workoutId', authMiddleware, deleteWorkout);