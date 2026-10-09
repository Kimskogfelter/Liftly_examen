import React from 'react';

const PostRecipe = ({ recipe, isDetailView }) => {
    if (!recipe) return null;

    return (
        <div className="mt-3 mb-2 bg-zinc-50 border border-zinc-200/80 rounded-xl p-3.5 text-xs space-y-3">
            <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${isDetailView ? "border-b border-zinc-200/60 pb-3" : ""}`}>
                <div className="flex items-center gap-2">
                    <h4 className="font-bold text-zinc-900 text-sm">{recipe.title}</h4>
                </div>
                <div className="flex items-center gap-2 flex-wrap text-zinc-600 font-medium text-[11px]">
                    {recipe.prepTimeMinutes > 0 && (
                        <span className="bg-white border border-zinc-200 px-2 py-1 rounded-lg">
                            {recipe.prepTimeMinutes} min
                        </span>
                    )}
                    {recipe.nutrition?.calories > 0 && (
                        <span className="bg-white border border-zinc-200 px-2 py-1 rounded-lg">
                            {recipe.nutrition.calories} kcal
                        </span>
                    )}
                    {recipe.nutrition?.protein > 0 && (
                        <span className="bg-white border border-zinc-200 px-2 py-1 rounded-lg">
                            {recipe.nutrition.protein}g protein
                        </span>
                    )}
                </div>
            </div>

            {isDetailView && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1 text-[11px]">
                    <div>
                        <h5 className="font-bold text-zinc-800 mb-1.5">Ingredients</h5>
                        <ul className="space-y-1 text-zinc-600">
                            {recipe.ingredients?.map((ing, idx) => (
                                <li key={idx} className="flex items-start gap-1.5">
                                    <span className="text-zinc-400">•</span>
                                    <span>{ing.name}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h5 className="font-bold text-zinc-800 mb-1.5">Instructions</h5>
                        <ul className="space-y-1 text-zinc-600">
                            {recipe.instructions?.map((step, idx) => (
                                <li key={idx} className="flex items-start gap-1.5">
                                    <span className="font-semibold text-zinc-400 shrink-0">{idx + 1}.</span>
                                    <span>{step}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PostRecipe;