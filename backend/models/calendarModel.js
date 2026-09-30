import mongoose, { Schema } from "mongoose";

const calendarLogSchema = new Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        date: { type: String, required: true }, // "YYYY-MM-DD"
        title: { type: String, required: true },
        workout: { type: mongoose.Schema.Types.ObjectId, ref: "Workout" }, // Koppling till det riktiga passet!
        notes: { type: String, trim: true },
        completed: { type: Boolean, default: false }
    },
    { timestamps: true }
);

export const CalendarLog = mongoose.model('CalendarLog', calendarLogSchema);