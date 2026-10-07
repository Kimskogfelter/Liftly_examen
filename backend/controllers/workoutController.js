import { Workout } from "../models/workoutModel.js";
import { User } from "../models/userModel.js";
import { CalendarLog } from "../models/calendarModel.js";
import { HttpError } from "../models/errorModel.js";
import mongoose from "mongoose";

// ---------------------------- CREATE WORKOUT --------------------------- 
// POST req: api/workouts/create
// PROTECTED
export const createWorkout = async (req, res, next) => {
    try {
        const { title, exercises } = req.body;

        // Validation: Check if required fields exist
        if ( !title || !exercises || exercises.length === 0) {
            return next(new HttpError("Please provide a title and at least one exercise.", 422));
        }

        // Create the workout document
        const newWorkout = await Workout.create({
            createdBy: req.user.id,
            title,
            exercises
        });

        return res.status(201).json({
            message: "Workout created successfully",
            workout: newWorkout
        });

    } catch (error) {
        return next(new HttpError(error.message || error, 500));
    }
};


export const finishWorkout = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { workoutId, date } = req.body;

        if (!workoutId || !date) {
            return res.status(400).json({ message: "Workout ID and date are required." });
        }

        const workoutDoc = await Workout.findById(workoutId);
        if (!workoutDoc) {
            return res.status(404).json({ message: "Workout not found." });
        }

        // 1. Leta efter en befintlig oavslutad post som matchar både datum och specifikt pass-ID
        let calendarEntry = await CalendarLog.findOne({ 
            user: userId, 
            date, 
            workout: workoutId, 
            completed: false 
        });

        // 2. Om ingen specifik hittades, leta efter valfri post på datumet (för bakåtkompatibilitet)
        if (!calendarEntry) {
            calendarEntry = await CalendarLog.findOne({ user: userId, date, completed: false });
        }

        if (calendarEntry) {
            // Uppdatera den hittade posten till avklarad
            calendarEntry.workout = workoutId;
            calendarEntry.title = workoutDoc.title;
            calendarEntry.completed = true;
            await calendarEntry.save();
        } else {
            // Om ingen ledig post fanns, skapa en ny
            calendarEntry = await CalendarLog.create({
                user: userId,
                date,
                title: workoutDoc.title,
                workout: workoutId,
                completed: true
            });
        }

        res.status(200).json({ 
            success: true, 
            message: "Workout finished and saved to calendar!", 
            calendarEntry 
        });

    } catch (error) {
        return next(new HttpError(error.message || "Server error while finishing workout", 500));
    }
};

// ---------------------------- GET USER WORKOUTS --------------------------- 
// GET req: api/workouts/user
// PROTECTED
export const getWorkouts = async (req, res, next) => {
    try {
        // Fetch all workout routines created by the logged-in user
        const workouts = await Workout.find({ createdBy: req.user.id })
            .sort({ createdAt: -1 });

        return res.status(200).json({
            message: "Workouts fetched successfully",
            workouts
        });

    } catch (error) {
        return next(new HttpError(error.message || error, 500));
    }
};

// ---------------------------- GET SINGLE WORKOUT --------------------------- 
// GET req: api/workouts/:workoutId
// PROTECTED
export const getWorkout = async (req, res, next) => {
    try {
        const { workoutId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(workoutId)) {
            return next(new HttpError("Invalid workout ID", 400));
        }

        const workout = await Workout.findById(workoutId);

        if (!workout) {
            return next(new HttpError("Workout not found", 404));
        }

        // 🔒 Ägarkontroll på rått ObjectId innan populate
        if (!workout.createdBy.equals(req.user.id)) {
            return next(new HttpError("You are not authorized to view this workout", 403));
        }

        // Populera säkert efter behörighetskontrollen
        await workout.populate("createdBy", "username profileImage");

        return res.status(200).json({
            message: "Workout found",
            workout
        });

    } catch (error) {
        return next(new HttpError(error.message || "Could not fetch workout", 500));
    }
};

// ---------------------------- UPDATE WORKOUT --------------------------- 
// PATCH req: api/workouts/:workoutId/update
// PROTECTED
export const updateWorkout = async (req, res, next) => {
    try {
        const { workoutId } = req.params;
        const { title, exercises } = req.body;

        if (!mongoose.Types.ObjectId.isValid(workoutId)) {
            return next(new HttpError("Invalid workout ID", 400));
        }

        const workout = await Workout.findById(workoutId);

        if (!workout) {
            return next(new HttpError("Workout not found", 404));
        }

        // Check ownership
        if (!workout.createdBy.equals(req.user.id)) {
            return next(new HttpError("You are not authorized to update this workout", 403));
        }

        // update only updated fields
        const updateFields = {};
        if (title) updateFields.title = title;
        if (exercises) updateFields.exercises = exercises;

        const updatedWorkout = await Workout.findByIdAndUpdate(
            workoutId,
            { $set: updateFields },
            { new: true, runValidators: true }
        );

        return res.status(200).json({
            message: "Workout updated successfully",
            workout: updatedWorkout
        });

    } catch (error) {
        return next(new HttpError(error.message || error, 500));
    }
};

// ---------------------------- DELETE WORKOUT --------------------------- 
// DELETE req: api/workouts/:workoutId
// PROTECTED
export const deleteWorkout = async (req, res, next) => {
    try {
        const { workoutId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(workoutId)) {
            return next(new HttpError("Invalid workout ID", 400));
        }

        const workout = await Workout.findById(workoutId);

        if (!workout) {
            return next(new HttpError("Workout not found", 404));
        }

        // Check ownership
        if (!workout.createdBy.equals(req.user.id)) {
            return next(new HttpError("You are not authorized to delete this workout", 403));
        }

        await Workout.findByIdAndDelete(workoutId);

        return res.status(200).json({
            message: `Workout with ID ${workoutId} successfully deleted`
        });

    } catch (error) {
        return next(new HttpError(error.message || error, 500));
    }
};