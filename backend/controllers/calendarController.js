import { CalendarLog } from "../models/calendarModel.js";
import { HttpError } from "../models/errorModel.js";

// Hämta alla träningsloggar (med poppulerat träningspass om det är kopplat)
export const getCalendarLogs = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { date, month } = req.query;

        const filter = { user: userId };

        if (date) {
            filter.date = date;
        } else if (month) {
            filter.date = { $regex: `^${month}` };
        }

        const logs = await CalendarLog.find(filter)
            .populate("workout") // Hämtar hela workout-objektet (titel, övningar etc.)
            .sort({ date: 1 });

        return res.status(200).json(logs);
    } catch (error) {
        return next(new HttpError("Could not fetch calendar logs", 500));
    }
};

// Skapa ett nytt träningspass i kalendern (med valfri koppling till ett befintligt workout-ID)
export const createCalendarLog = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { date, title, workout, notes, completed } = req.body;

        if (!date || !title) {
            return next(new HttpError("Date and title are required", 400));
        }

        const newLog = await CalendarLog.create({
            user: userId,
            date,
            title,
            workout: workout || null, // Koppling till Workout-modellen om det finns
            notes,
            completed: completed || false
        });

        // Populera direkt så att frontend får med träningsdatan direkt vid skapande
        const populatedLog = await CalendarLog.findById(newLog._id).populate("workout");

        return res.status(201).json({ message: "Log created successfully", log: populatedLog });
    } catch (error) {
        return next(new HttpError("Could not create calendar log", 500));
    }
};

// Uppdatera träningspass (t.ex. bocka av completed, byta titel eller koppla ett workout)
export const updateCalendarLog = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;
        const { title, workout, notes, completed } = req.body;

        const log = await CalendarLog.findOne({ _id: id, user: userId });

        if (!log) {
            return next(new HttpError("Log not found or unauthorized", 404));
        }

        if (title !== undefined) log.title = title;
        if (workout !== undefined) log.workout = workout;
        if (notes !== undefined) log.notes = notes;
        if (completed !== undefined) log.completed = completed;

        await log.save();
        const updatedLog = await CalendarLog.findById(id).populate("workout");

        return res.status(200).json({ message: "Log updated successfully", log: updatedLog });
    } catch (error) {
        return next(new HttpError("Could not update calendar log", 500));
    }
};

// Radera kalenderbokningen
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