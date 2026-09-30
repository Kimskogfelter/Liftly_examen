import express from "express";
import { getCalendarLogs, createCalendarLog, updateCalendarLog, deleteCalendarLog } from "../controllers/calendarController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

export const calendarRouter = express.Router();

calendarRouter.get("/", authMiddleware, getCalendarLogs);
calendarRouter.post("/", authMiddleware, createCalendarLog);
calendarRouter.patch("/:id", authMiddleware, updateCalendarLog);
calendarRouter.delete("/:id", authMiddleware, deleteCalendarLog);