import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { LuApple } from "react-icons/lu";
import { FiPlus } from "react-icons/fi";

const FoodLogPage = () => {
    const todayStr = new Date().toISOString().split('T')[0];
    const [selectedDate, setSelectedDate] = useState(todayStr);
    
    const [foodLog, setFoodLog] = useState({ entries: [] });
    const [loading, setLoading] = useState(false);

    // Formulär-state för ny måltid
    const [mealName, setMealName] = useState('');
    const [calories, setCalories] = useState('');
    const [protein, setProtein] = useState('');
    const [carbs, setCarbs] = useState('');
    const [fat, setFat] = useState('');

    useEffect(() => {
        fetchFoodLog(selectedDate);
    }, [selectedDate]);

    const fetchFoodLog = async (date) => {
        try {
            setLoading(true);
            const res = await api.get(`/foodlogs/${date}`);
            setFoodLog(res.data);
        } catch (err) {
            console.error("Error fetching food log:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddEntry = async (e) => {
        e.preventDefault();
        if (!calories) return;

        try {
            const res = await api.post(`/foodlogs/${selectedDate}/foodLog`, {
                mealName: mealName || "Meal",
                calories: Number(calories),
                protein: Number(protein) || 0,
                carbs: Number(carbs) || 0,
                fat: Number(fat) || 0
            });

            setFoodLog(res.data);
            setMealName('');
            setCalories('');
            setProtein('');
            setCarbs('');
            setFat('');
        } catch (err) {
            console.error("Error adding food entry:", err);
        }
    };

    const handleDeleteEntry = async (entryId) => {
        try {
            const res = await api.delete(`/foodlogs/${selectedDate}/foodLog/${entryId}`);
            setFoodLog(res.data);
        } catch (err) {
            console.error("Error deleting food entry:", err);
        }
    };

    const totalCalories = foodLog.entries?.reduce((acc, curr) => acc + curr.calories, 0) || 0;
    const totalProtein = foodLog.entries?.reduce((acc, curr) => acc + curr.protein, 0) || 0;
    const totalCarbs = foodLog.entries?.reduce((acc, curr) => acc + curr.carbs, 0) || 0;
    const totalFat = foodLog.entries?.reduce((acc, curr) => acc + curr.fat, 0) || 0;

    return (
        <section className="px-2 md:px-6 max-w-2xl mx-auto pt-20 md:pt-24 xl:pt-8 pb-24 font-sans text-gray-800">
            {/* Header */}
            <div className="w-full text-center mb-8 border-b border-zinc-200 pb-5">
                <div className="flex items-center justify-center gap-3 mb-1.5">
                    <div className="p-2 bg-black text-white rounded-lg shadow-xs shrink-0">
                        <LuApple size={18} />
                    </div>
                    <h1 className="text-xl font-bold text-gray-900 tracking-wide">
                        Food Log
                    </h1>
                </div>
                <p className="text-xs text-zinc-500 font-medium">
                    Track your daily calories and macros
                </p>
            </div>

            {/* Datumväljare & Sammanfattningskort - Uppdaterad till border-gray-100 */}
            <div className="bg-white border border-gray-100 rounded-lg p-5 shadow-sm mb-6">
                <div className="flex justify-between items-center mb-4">
                    <span className="text-xs font-semibold text-zinc-700">Select Date</span>
                    <input 
                        type="date" 
                        value={selectedDate} 
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="border border-zinc-200 px-3 py-1.5 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-black"
                    />
                </div>

                <div className="grid grid-cols-4 gap-2 pt-3 border-t border-zinc-100 text-center">
                    <div>
                        <p className="text-[10px] text-zinc-400 font-medium uppercase">Calories</p>
                        <p className="text-base font-bold text-gray-900">{totalCalories}</p>
                    </div>
                    <div>
                        <p className="text-[10px] text-zinc-400 font-medium uppercase">Protein</p>
                        <p className="text-base font-bold text-gray-900">{totalProtein}g</p>
                    </div>
                    <div>
                        <p className="text-[10px] text-zinc-400 font-medium uppercase">Carbs</p>
                        <p className="text-base font-bold text-gray-900">{totalCarbs}g</p>
                    </div>
                    <div>
                        <p className="text-[10px] text-zinc-400 font-medium uppercase">Fat</p>
                        <p className="text-base font-bold text-gray-900">{totalFat}g</p>
                    </div>
                </div>
            </div>

            {/* Formulär för att lägga till mat - Uppdaterad till border-gray-100 */}
            <form onSubmit={handleAddEntry} className="bg-white border border-gray-100 rounded-lg p-5 shadow-sm mb-6">
                <h2 className="font-semibold text-zinc-900 mb-3 text-xs">Add Meal / Entry</h2>
                <div className="space-y-3 mb-4">
                    <input 
                        type="text" 
                        placeholder="Meal name (e.g. Breakfast, Lunch)" 
                        value={mealName}
                        onChange={(e) => setMealName(e.target.value)}
                        className="w-full border border-zinc-200 p-2.5 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-black"
                    />
                    <div className="grid grid-cols-2 gap-3">
                        <input 
                            type="number" 
                            placeholder="Calories (kcal)*" 
                            value={calories}
                            onChange={(e) => setCalories(e.target.value)}
                            className="border border-zinc-200 p-2.5 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-black"
                            required
                        />
                        <input 
                            type="number" 
                            placeholder="Protein (g)" 
                            value={protein}
                            onChange={(e) => setProtein(e.target.value)}
                            className="border border-zinc-200 p-2.5 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-black"
                        />
                        <input 
                            type="number" 
                            placeholder="Carbs (g)" 
                            value={carbs}
                            onChange={(e) => setCarbs(e.target.value)}
                            className="border border-zinc-200 p-2.5 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-black"
                        />
                        <input 
                            type="number" 
                            placeholder="Fat (g)" 
                            value={fat}
                            onChange={(e) => setFat(e.target.value)}
                            className="border border-zinc-200 p-2.5 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-black"
                        />
                    </div>
                </div>
                <button type="submit" className="w-full bg-black text-white py-3 rounded-xl font-semibold hover:bg-zinc-800 transition text-xs shadow-sm cursor-pointer flex items-center justify-center gap-2">
                    <FiPlus size={16} />
                    <span>Add to Log</span>
                </button>
            </form>

            {/* Lista över dagens poster - Uppdaterad till border-gray-100 */}
            <div className="space-y-3">
                <h2 className="font-semibold text-zinc-900 text-xs">Today's Entries</h2>
                {loading ? (
                    <p className="text-xs text-zinc-400">Loading...</p>
                ) : foodLog.entries?.length === 0 ? (
                    <div className="text-center py-8 bg-zinc-50 rounded-2xl border border-dashed border-zinc-200">
                        <p className="text-zinc-500 text-xs font-medium">No food logged for this date yet.</p>
                    </div>
                ) : (
                    [...foodLog.entries].reverse().map((entry) => (
                        <div key={entry._id} className="border border-gray-100 p-4 rounded-lg flex justify-between items-center bg-white shadow-sm">
                            <div>
                                <p className="font-semibold text-zinc-900 text-xs">{entry.mealName}</p>
                                <p className="text-[11px] text-zinc-500 mt-0.5">
                                    <span className="font-medium text-zinc-800">{entry.calories} kcal</span> | P: {entry.protein}g | C: {entry.carbs}g | F: {entry.fat}g
                                </p>
                            </div>
                            <button 
                                onClick={() => handleDeleteEntry(entry._id)}
                                className="text-zinc-400 hover:text-red-600 text-xs font-medium transition cursor-pointer"
                            >
                                Delete
                            </button>
                        </div>
                    ))
                )}
            </div>
        </section>
    );
};

export default FoodLogPage;