import React, { useState } from "react";
import { FiPlus, FiTrash2 } from "react-icons/fi";

function RecipeForm({ 
  recipeTitle, setRecipeTitle, 
  prepTimeMinutes, setPrepTimeMinutes, 
  calories, setCalories, 
  protein, setProtein, 
  ingredients, setIngredients, 
  instructions, setInstructions, 
  onSave, onCancel, onClear
}) {
  const [errorMsg, setErrorMsg] = useState("");

  const handleIngredientChange = (index, value) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = value;
    setIngredients(newIngredients);
  };

  const addIngredient = () => {
    setIngredients([...ingredients, ""]);
  };

  const removeIngredient = (index) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const handleInstructionChange = (index, value) => {
    const newInstructions = [...instructions];
    newInstructions[index] = value;
    setInstructions(newInstructions);
  };

  const addInstruction = () => {
    setInstructions([...instructions, ""]);
  };

  const removeInstruction = (index) => {
    setInstructions(instructions.filter((_, i) => i !== index));
  };

  // Strikt validering för ALLA fält innan onSave får köra igång
  const handleSaveClick = () => {
    setErrorMsg("");

    if (!recipeTitle || !recipeTitle.trim()) {
      setErrorMsg("Please enter a recipe title");
      return;
    }
    if (prepTimeMinutes === "" || prepTimeMinutes === undefined) {
      setErrorMsg("Please enter preparation time");
      return;
    }
    if (calories === "" || calories === undefined) {
      setErrorMsg("Please enter calories");
      return;
    }
    if (protein === "" || protein === undefined) {
      setErrorMsg("Please enter protein");
      return;
    }
    if (ingredients.length === 0 || ingredients.some(ing => !ing.trim())) {
      setErrorMsg("Please fill in all ingredients");
      return;
    }
    if (instructions.length === 0 || instructions.some(step => !step.trim())) {
      setErrorMsg("Please fill in all instruction steps");
      return;
    }

    // Om allt är godkänt, anropa spara
    onSave();
  };

  return (
    <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
      {/* Rubrik & Tillbaka */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-2">
        <h4 className="text-xs font-bold text-gray-900">Add Recipe</h4>
        <button 
          type="button" 
          onClick={onCancel} 
          className="text-xs text-zinc-500 hover:text-black cursor-pointer font-medium"
        >
          ← Back to post
        </button>
      </div>

      {/* Felmeddelande */}
      {errorMsg && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-[11px] p-2 rounded-lg font-medium">
          {errorMsg}
        </div>
      )}

      {/* Recepttitel */}
      <div>
        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1 block">Recipe Title *</label>
        <input
          type="text"
          placeholder="e.g., Chicken Sandwich"
          value={recipeTitle}
          onChange={(e) => setRecipeTitle(e.target.value)}
          className="w-full text-xs border border-zinc-200 rounded-lg p-2.5 bg-gray-50/30 focus:outline-none focus:border-zinc-400"
        />
      </div>

      {/* Tid & Makros (Nu med tvingande koll) */}
      <div className="grid grid-cols-3 gap-2">
        <div>
          <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1 block">Time (min) *</label>
          <input
            type="number"
            placeholder="10"
            value={prepTimeMinutes}
            onChange={(e) => setPrepTimeMinutes(e.target.value)}
            className="w-full text-xs border border-zinc-200 rounded-lg p-2 bg-gray-50/30 focus:outline-none"
          />
        </div>
        <div>
          <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1 block">Calories *</label>
          <input
            type="number"
            placeholder="350"
            value={calories}
            onChange={(e) => setCalories(e.target.value)}
            className="w-full text-xs border border-zinc-200 rounded-lg p-2 bg-gray-50/30 focus:outline-none"
          />
        </div>
        <div>
          <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1 block">Protein (g) *</label>
          <input
            type="number"
            placeholder="30"
            value={protein}
            onChange={(e) => setProtein(e.target.value)}
            className="w-full text-xs border border-zinc-200 rounded-lg p-2 bg-gray-50/30 focus:outline-none"
          />
        </div>
      </div>

      {/* --- INGREDIENSER --- */}
      <div className="space-y-2 pt-1">
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-bold text-zinc-700">Ingredients *</label>
          <button
            type="button"
            onClick={addIngredient}
            className="text-[11px] font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 cursor-pointer"
          >
            <FiPlus size={13} /> Add ingredient
          </button>
        </div>

        {ingredients.map((ing, index) => (
          <div key={index} className="flex items-center gap-1.5">
            <input
              type="text"
              placeholder="e.g. 300g chicken breast"
              value={ing}
              onChange={(e) => handleIngredientChange(index, e.target.value)}
              className="flex-1 text-xs border border-zinc-200 rounded-lg p-2 bg-gray-50/30 focus:outline-none"
            />
            {ingredients.length > 1 && (
              <button
                type="button"
                onClick={() => removeIngredient(index)}
                className="text-zinc-400 hover:text-red-500 transition-colors p-1 cursor-pointer"
              >
                <FiTrash2 size={14} />
              </button>
            )}
          </div>
        ))}
      </div>

      {/* --- INSTRUKTIONER --- */}
      <div className="space-y-2 pt-2">
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-bold text-zinc-700">Instructions / Steps *</label>
          <button
            type="button"
            onClick={addInstruction}
            className="text-[11px] font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 cursor-pointer"
          >
            <FiPlus size={13} /> Add step
          </button>
        </div>

        {instructions.map((step, index) => (
          <div key={index} className="flex items-center gap-1.5">
            <span className="text-[11px] font-semibold text-zinc-400 w-4 text-right">{index + 1}.</span>
            <input
              type="text"
              placeholder={`Step ${index + 1}`}
              value={step}
              onChange={(e) => handleInstructionChange(index, e.target.value)}
              className="flex-1 text-xs border border-zinc-200 rounded-lg p-2 bg-gray-50/30 focus:outline-none"
            />
            {instructions.length > 1 && (
              <button
                type="button"
                onClick={() => removeInstruction(index)}
                className="text-zinc-400 hover:text-red-500 transition-colors p-1 cursor-pointer"
              >
                <FiTrash2 size={14} />
              </button>
            )}
          </div>
        ))}
      </div>

      {/* --- KNAPPAR LÄNGST NER --- */}
      <div className="pt-6 pb-2 mt-4 border-t border-gray-100 flex items-center justify-between">
        <button
          type="button"
          onClick={onClear}
          className="text-xs text-red-600 hover:text-red-700 font-medium cursor-pointer"
        >
          Clear all
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-semibold py-1.5 px-3 rounded-lg text-xs transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSaveClick}
            className="bg-[#3A3939] hover:bg-zinc-800 text-white font-semibold py-1.5 px-4 rounded-lg text-xs transition-colors cursor-pointer shadow-sm"
          >
            Save Recipe
          </button>
        </div>
      </div>
    </div>
  );
}

export default RecipeForm;