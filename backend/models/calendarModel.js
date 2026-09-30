import mongoose from "mongoose";

const calendarLogSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        date: {
            type: String, // Format: "YYYY-MM-DD"
            required: true
        },
        title: {
            type: String,
            required: true,
            trim: true
        },
        notes: {
            type: String,
            trim: true
        },
        completed: {
            type: Boolean,
            default: false
        }
    },
    { timestamps: true }
);

export const CalendarLog = mongoose.model("CalendarLog", calendarLogSchema);