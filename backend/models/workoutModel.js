import mongoose, { Schema } from "mongoose";

const exerciseSchema = new Schema({
    name: { type: String, required: true },
    sets: { type: Number, required: true, default: 3 },
    reps: { type: Number, required: true, default: 10 },
    kgs: { type: Number, required: true, default: 0 } // Ändrade default till 0 kg
});

const workoutSchema = new Schema({
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    day: { 
        type: String, 
        required: true,
        enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"] // Låser till giltiga dagar
    },
    title: { type: String, required: true }, // ex: "Legs & Glutes", "Push Day", "Rest & Recovery"
    exercises: [exerciseSchema]
}, { timestamps: true });

export const Workout = mongoose.model('Workout', workoutSchema);