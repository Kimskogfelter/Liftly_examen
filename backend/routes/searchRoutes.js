import { Router } from 'express';
import { searchEverything } from '../controllers/searchController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';


// create router
export const searchRouter = Router();



// ---------------------------- search routes ---------------------------

searchRouter.get('/',authMiddleware, searchEverything)