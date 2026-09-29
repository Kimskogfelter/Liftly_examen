const mongoose = require("mongoose");

const foodEntrySchema = new mongoose.Schema({
    mealName: { type: String, default: "Meal" }, // T.ex. Frukost, Lunch, Snacks
    calories: { type: Number, required: true, default: 0 },
    protein: { type: Number, default: 0 },
    carbs: { type: Number, default: 0 },
    fat: { type: Number, default: 0 },
});

const foodLogSchema = new mongoose.Schema(
    {
        user: { 
            type: mongoose.Schema.Types.ObjectId, 
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

module.exports = mongoose.model("FoodLog", foodLogSchema);