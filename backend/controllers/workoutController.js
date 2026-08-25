import { Workout } from "../models/workoutModel.js";
import { User } from "../models/userModel.js";
import { HttpError } from "../models/errorModel.js";
import mongoose from "mongoose";

// ---------------------------- CREATE WORKOUT --------------------------- 
// POST req: api/workouts/create
// PROTECTED
export const createWorkout = async (req, res, next) => {
    try {
        const { day, exercises } = req.body;

        // Validation: Check if required fields exist
        if (!day || !exercises || exercises.length === 0) {
            return next(new HttpError("Please provide a day and at least one exercise.", 422));
        }

        // Create the workout document
        const newWorkout = await Workout.create({
            createdBy: req.user.id,
            day,
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

        return res.status(200).json({
            message: "Workout found",
            workout
        });

    } catch (error) {
        return next(new HttpError(error.message || error, 500));
    }
};

// ---------------------------- UPDATE WORKOUT --------------------------- 
// PATCH req: api/workouts/:workoutId/update
// PROTECTED
export const updateWorkout = async (req, res, next) => {
    try {
        const { workoutId } = req.params;
        const { day, exercises } = req.body;

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

        const updatedWorkout = await Workout.findByIdAndUpdate(
            workoutId,
            { $set: { day, exercises } },
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