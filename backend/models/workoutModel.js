import mongoose, { Schema } from "mongoose";

const setSchema = new Schema({
    reps: { type: Number, required: true, default: 10 },
    kgs: { type: Number, required: true, default: 0 }
});

const exerciseSchema = new Schema({
    name: { type: String, required: true },
    sets: [setSchema]
});

const workoutSchema = new Schema({
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    day: { 
        type: String, 
        required: true,
        enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
    },
    title: { type: String, required: true },
    exercises: [exerciseSchema]
}, { timestamps: true });

export const Workout = mongoose.model('Workout', workoutSchema);