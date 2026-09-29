import { FoodLog } from '../models/foodLogModel.js';

// 1. Hämta matlogg för ett specifikt datum (skapar en tom om den inte finns)
export const getFoodLog = async (req, res, next) => {
    try {
        const { date } = req.params;
        const userId = req.user._id; // Beroende på hur din authMiddleware sätter användaren

        let foodLog = await FoodLog.findOne({ user: userId, date });

        if (!foodLog) {
            foodLog = new FoodLog({
                user: userId,
                date,
                entries: []
            });
            await foodLog.save();
        }

        res.status(200).json(foodLog);
    } catch (err) {
        next(err);
    }
};

// 2. Skapa/lägga till en ny matpost (entry) för ett datum
export const createFoodLog = async (req, res, next) => {
    try {
        const { date } = req.params;
        const userId = req.user._id;
        const { mealName, calories, protein, carbs, fat } = req.body;

        if (!calories && calories !== 0) {
            return res.status(400).json({ message: "Calories are required" });
        }

        let foodLog = await FoodLog.findOne({ user: userId, date });

        if (!foodLog) {
            foodLog = new FoodLog({
                user: userId,
                date,
                entries: []
            });
        }

        foodLog.entries.push({
            mealName: mealName || "Meal",
            calories,
            protein: protein || 0,
            carbs: carbs || 0,
            fat: fat || 0
        });

        await foodLog.save();
        res.status(201).json(foodLog);
    } catch (err) {
        next(err);
    }
};

// 3. Ta bort en specifik matpost från loggen
export const deleteFoodLog = async (req, res, next) => {
    try {
        const { date, foodLogId } = req.params;
        const userId = req.user._id;

        const foodLog = await FoodLog.findOne({ user: userId, date });

        if (!foodLog) {
            return res.status(404).json({ message: "Food log not found" });
        }

        // Filtrera bort posten som matchar ID:t
        foodLog.entries = foodLog.entries.filter(
            (entry) => entry._id.toString() !== foodLogId
        );

        await foodLog.save();
        res.status(200).json(foodLog);
    } catch (err) {
        next(err);
    }
};