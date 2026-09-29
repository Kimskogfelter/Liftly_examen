import { Router } from 'express';
import { createFoodLog, getFoodLog, deleteFoodLog } from '../controllers/foodLogController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

// create router
export const foodLogRouter = Router();

foodLogRouter.post('/:date/foodLog', authMiddleware, createFoodLog) 
foodLogRouter.get('/:date',authMiddleware, getFoodLog)
foodLogRouter.delete('/:date/foodLog/:foodLogId',authMiddleware, deleteFoodLog)