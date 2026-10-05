import express from 'express';
import { sendContactMessage } from '../controllers/contactController.js'; // Eller var din controller ligger

export const contactRouter = express.Router();

// POST /api/contact (eller vad du har satt i server.js)
contactRouter.post('/', sendContactMessage);