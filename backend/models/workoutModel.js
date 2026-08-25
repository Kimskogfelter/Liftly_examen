import mongoose, { Schema } from "mongoose";

// Schema for each exercise
const exerciseSchema = new Schema({
    name: { type: String, required: true },
    sets: { type: Number, required: true, default: 3 },
    reps: { type: Number, required: true, default: 10 },
    kgs: { type: Number, required: true, default: 10 }
});

// Schema for workout session
const workoutSchema = new Schema({
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    day: { type: String, required: true }, 
    exercises: [exerciseSchema] 
}, { timestamps: true });

export const Workout = mongoose.model('Workout', workoutSchema);