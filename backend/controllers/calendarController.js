import { CalendarLog } from "../models/calendarModel.js";
import { HttpError } from "../models/errorModel.js";

// Hämta alla träningsloggar för inloggad användare (filtrera på specifik dag eller månad)
export const getCalendarLogs = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { date, month } = req.query;

        const filter = { user: userId };

        if (date) {
            filter.date = date; // Ex: "2026-09-30"
        } else if (month) {
            filter.date = { $regex: `^${month}` }; // Ex: "2026-09" matchar hela månaden
        }

        const logs = await CalendarLog.find(filter).sort({ date: 1 });

        return res.status(200).json(logs);
    } catch (error) {
        return next(new HttpError("Could not fetch calendar logs", 500));
    }
};

// Skapa ett nytt träningspass på ett datum
export const createCalendarLog = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { date, title, notes, completed } = req.body;

        if (!date || !title) {
            return next(new HttpError("Date and title are required", 400));
        }

        const newLog = await CalendarLog.create({
            user: userId,
            date,
            title,
            notes,
            completed: completed || false
        });

        return res.status(201).json({ message: "Log created successfully", log: newLog });
    } catch (error) {
        return next(new HttpError("Could not create calendar log", 500));
    }
};

// Uppdatera träningspass (t.ex. bocka av som completed eller ändra titel/anteckningar)
export const updateCalendarLog = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;
        const { title, notes, completed } = req.body;

        const log = await CalendarLog.findOne({ _id: id, user: userId });

        if (!log) {
            return next(new HttpError("Log not found or unauthorized", 404));
        }

        if (title !== undefined) log.title = title;
        if (notes !== undefined) log.notes = notes;
        if (completed !== undefined) log.completed = completed;

        const updatedLog = await log.save();

        return res.status(200).json({ message: "Log updated successfully", log: updatedLog });
    } catch (error) {
        return next(new HttpError("Could not update calendar log", 500));
    }
};

// Radera ett träningspass
export const deleteCalendarLog = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;

        const log = await CalendarLog.findOne({ _id: id, user: userId });

        if (!log) {
            return next(new HttpError("Log not found or unauthorized", 404));
        }

        await CalendarLog.findByIdAndDelete(id);

        return res.status(200).json({ message: "Log deleted successfully", id });
    } catch (error) {
        return next(new HttpError("Could not delete calendar log", 500));
    }
};