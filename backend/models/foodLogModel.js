import mongoose, { Schema } from "mongoose";

const foodEntrySchema = new Schema({
    mealName: { type: String, default: "Meal" }, // T.ex. Frukost, Lunch, Snacks
    calories: { type: Number, required: true, default: 0 },
    protein: { type: Number, default: 0 },
    carbs: { type: Number, default: 0 },
    fat: { type: Number, default: 0 },
});

const foodLogSchema = new Schema(
    {
        user: { 
            type: Schema.Types.ObjectId, 
            ref: "User", 
            required: true 
        },
        date: { 
            type: String, // Format: "YYYY-MM-DD" för att lätt matcha mot kalendern
            required: true 
        },
        entries: [foodEntrySchema], // Listan med det man ätit under dagen
    },
    { timestamps: true }
);

export const FoodLog = mongoose.model("FoodLog", foodLogSchema);