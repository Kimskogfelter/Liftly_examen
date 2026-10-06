import mongoose, { Schema } from "mongoose";

// Sub-schema för att dela månad från kalendern
const calendarShareSchema = new mongoose.Schema({
    month: { type: String, required: true }, // t.ex. "October 2026"
    days: [{
        date: { type: String }, // t.ex. "2026-10-01" eller dagnummer "1"
        dayNumber: { type: Number }, // 1, 2, 3...
        title: { type: String, default: "" }, // t.ex. "Överkropp"
        completed: { type: Boolean, default: false },
        hasWorkout: { type: Boolean, default: false }
    }]
}, { _id: false });

// Sub-schema för enskilda ingredienser
const ingredientSchema = new mongoose.Schema({
    name: { type: String, required: true },
    amount: { type: Number, required: true },
    unit: { type: String, default: "" }, // t.ex. "g", "st", "msk"
    calories: { type: Number, default: 0 },
    protein: { type: Number, default: 0 }
}, { _id: false });

// Sub-schema för näringsvärden (makros)
const nutritionSchema = new mongoose.Schema({
    calories: { type: Number, default: 0 },
    protein: { type: Number, default: 0 },
    carbs: { type: Number, default: 0 },
    fat: { type: Number, default: 0 }
}, { _id: false });

// Sub-schema för själva receptet
const recipeSchema = new mongoose.Schema({
    title: { type: String, required: true },
    prepTimeMinutes: { type: Number, default: 0 },
    servings: { type: Number, default: 1 },
    nutrition: nutritionSchema,
    ingredients: [ingredientSchema],
    instructions: [{ type: String }]
}, { _id: false });

// schema for post
const postSchema = new mongoose.Schema({
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    media: [{ type: String }],
    content: { type: String },
    spotifyUrl: { type: String, default: "" },
    comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
    likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
    hashtags: [{ type: String }],
    category: { 
        type: String, 
        enum: ["General", "Food", "Supplements", "Training", "Music", "Activewear", "Mindset & Recovery", "Helpme"],
        default: "General"
    },
    subCategory: { 
        type: String, 
        default: "" 
    },
    // Frivilligt recept-fält
    recipe: { 
        type: recipeSchema, 
        default: null 
    },
    // skapas från delning i kalendern
    calendarShare: {
    type: calendarShareSchema,
    default: null
}
}, { timestamps: true });

// post model
export const Post = mongoose.model('Post', postSchema);