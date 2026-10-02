import React, { useState } from "react";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";
import { FiPlus } from "react-icons/fi";
import { FaRegTrashAlt } from "react-icons/fa";

function EditPostModal({ onClose, handleEditPost, post, currentUser }) {

  const postId = post._id;
  const navigate = useNavigate();
  const [content, setContent] = useState(post.content || "");
  
  // Recept-states
  const [recipeTitle, setRecipeTitle] = useState(post.recipe?.title || "");
  const [prepTime, setPrepTime] = useState(post.recipe?.prepTimeMinutes || "");
  const [calories, setCalories] = useState(post.recipe?.nutrition?.calories || "");
  const [protein, setProtein] = useState(post.recipe?.nutrition?.protein || "");
  
  // Ingredienser & Instruktioner som arrayer
  const [ingredients, setIngredients] = useState(post.recipe?.ingredients || []);
  const [instructions, setInstructions] = useState(post.recipe?.instructions || []);

  const [error, setError] = useState("");

  // Hantera ingredienser
  const handleIngredientChange = (index, value) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = { ...newIngredients[index], name: value };
    setIngredients(newIngredients);
  };

  const addIngredient = () => {
    setIngredients([...ingredients, { name: "" }]);
  };

  const removeIngredient = (index) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  // Hantera instruktioner
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

  // Spara ändringar
const editPost = async (e) => {
    e.preventDefault();

    try {
      const updatedData = {
        content,
      };

      if (post.recipe) {
        const formattedIngredients = ingredients
          .map(ing => {
            const nameVal = typeof ing === 'string' ? ing : ing.name;
            if (!nameVal || nameVal.trim() === "") return null;
            
            return {
              name: nameVal.trim(),
              amount: ing.amount || "" // Fångar upp eller sätter amount så Mongoose inte klagar
            };
          })
          .filter(Boolean);

        const formattedInstructions = instructions
          .filter(ins => ins && ins.trim() !== "");

        updatedData.recipe = {
          ...post.recipe,
          title: recipeTitle,
          prepTimeMinutes: Number(prepTime) || 0,
          nutrition: {
            ...post.recipe.nutrition,
            calories: Number(calories) || 0,
            protein: Number(protein) || 0,
          },
          ingredients: formattedIngredients,
          instructions: formattedInstructions
        };
      }

      const response = await api.patch(`/posts/${postId}/update`, updatedData);

      const updatedPost = response.data.updatedPost;
      handleEditPost(updatedPost);

      if (response.status === 200) {
        navigate('/home');
      }

      onClose();

    } catch (err) {
      const errorResponse = err.response?.data;
      setError(errorResponse?.message || "Your post could not be updated. Please try again.");
    }
  };

  return (
    <>
      {/* Outer card wrapper - Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 font-sans bg-black/40">

        {/* Edit container */}
        <div className="w-full max-w-lg bg-white rounded-xl p-6 shadow-2xl border border-gray-100 text-left max-h-[90vh] overflow-y-auto">

          <h3 className="text-sm font-bold text-gray-900 mb-4">Edit Post</h3>

          <form onSubmit={editPost} className="space-y-4">
            
            {/* Caption */}
            <div className="space-y-1">
              <label className="block text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Caption</label>
              <textarea
                name="content"
                placeholder="What's on your mind?"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full min-h-24 text-xs text-gray-800 placeholder-gray-400 border border-zinc-200 rounded-lg p-3 resize-none focus:outline-none focus:border-zinc-400 bg-gray-50/30 transition-colors"
              ></textarea>
            </div>

            {/* OM POSTEN HAR ETT RECEPT: Styling som matchar Workout Routine */}
            {post.recipe && (
              <div className="space-y-4 pt-2 border-t border-gray-100">
                
                {/* Recept Titel */}
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Recipe Title</label>
                  <input
                    type="text"
                    value={recipeTitle}
                    onChange={(e) => setRecipeTitle(e.target.value)}
                    className="w-full bg-white border border-zinc-200 rounded-lg px-3.5 py-2.5 text-xs text-zinc-800 focus:outline-none focus:border-zinc-400 shadow-2xs"
                  />
                </div>

                {/* Tid & Makros */}
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1">Time (min)</label>
                    <input
                      type="number"
                      value={prepTime}
                      onChange={(e) => setPrepTime(e.target.value)}
                      className="w-full bg-white border border-zinc-200 rounded-lg px-3 py-2 text-xs text-zinc-800 focus:outline-none focus:border-zinc-400"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1">Calories</label>
                    <input
                      type="number"
                      value={calories}
                      onChange={(e) => setCalories(e.target.value)}
                      className="w-full bg-white border border-zinc-200 rounded-lg px-3 py-2 text-xs text-zinc-800 focus:outline-none focus:border-zinc-400"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1">Protein (g)</label>
                    <input
                      type="number"
                      value={protein}
                      onChange={(e) => setProtein(e.target.value)}
                      className="w-full bg-white border border-zinc-200 rounded-lg px-3 py-2 text-xs text-zinc-800 focus:outline-none focus:border-zinc-400"
                    />
                  </div>
                </div>

                {/* INGREDIENTS SEKTION */}
                <div className="space-y-2">
                  <label className="block text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Ingredients</label>
                  
                  {ingredients.map((ing, idx) => (
                    <div key={idx} className="bg-zinc-50/70 border border-zinc-200/80 rounded-xl p-3 flex items-center justify-between gap-2">
                      <input
                        type="text"
                        value={ing.name || ""}
                        onChange={(e) => handleIngredientChange(idx, e.target.value)}
                        placeholder="e.g. 500g chicken breast"
                        className="w-full bg-white border border-zinc-200 rounded-lg px-3 py-2 text-xs text-zinc-800 focus:outline-none focus:border-zinc-400 shadow-2xs"
                      />
                      <button
                        type="button"
                        onClick={() => removeIngredient(idx)}
                        className="p-2 text-zinc-400 hover:text-red-500 transition-colors cursor-pointer shrink-0"
                      >
                        <FaRegTrashAlt size={14} />
                      </button>
                    </div>
                  ))}

                  {/* Add Ingredient Knapp (Strålande streckad stil) */}
                  <button
                    type="button"
                    onClick={addIngredient}
                    className="w-full border-2 border-dashed border-zinc-200 hover:border-zinc-300 text-zinc-600 rounded-xl py-2.5 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer bg-white"
                  >
                    <FiPlus size={15} /> Add Ingredient
                  </button>
                </div>

                {/* INSTRUCTIONS SEKTION */}
                <div className="space-y-2 pt-1">
                  <label className="block text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Instructions</label>
                  
                  {instructions.map((step, idx) => (
                    <div key={idx} className="bg-zinc-50/70 border border-zinc-200/80 rounded-xl p-3 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 w-full">
                        <span className="text-xs font-bold text-zinc-400 shrink-0">{idx + 1}.</span>
                        <input
                          type="text"
                          value={step || ""}
                          onChange={(e) => handleInstructionChange(idx, e.target.value)}
                          placeholder="Describe step..."
                          className="w-full bg-white border border-zinc-200 rounded-lg px-3 py-2 text-xs text-zinc-800 focus:outline-none focus:border-zinc-400 shadow-2xs"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeInstruction(idx)}
                        className="p-2 text-zinc-400 hover:text-red-500 transition-colors cursor-pointer shrink-0"
                      >
                        <FaRegTrashAlt size={14} />
                      </button>
                    </div>
                  ))}

                  {/* Add Step Knapp */}
                  <button
                    type="button"
                    onClick={addInstruction}
                    className="w-full border-2 border-dashed border-zinc-200 hover:border-zinc-300 text-zinc-600 rounded-xl py-2.5 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer bg-white"
                  >
                    <FiPlus size={15} /> Add Step
                  </button>
                </div>

              </div>
            )}

            {/* Error message */}
            {error && (
              <div className="bg-red-50 text-red-600 text-[11px] p-2 rounded-lg font-medium border border-red-100 text-left">
                {error}
              </div>
            )}

            {/* Footer Row: Action buttons */}
            <div className="flex items-center justify-end pt-3 border-t border-gray-100 gap-2">
              <button
                type="button"
                onClick={onClose}
                className="bg-gray-100 hover:bg-gray-200 text-gray-600 font-semibold py-2 px-4 rounded-xl transition-colors cursor-pointer text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-[#3A3939] hover:bg-zinc-800 text-white font-semibold py-2 px-4 rounded-xl transition-colors cursor-pointer text-xs shadow-sm"
              >
                Update Post
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default EditPostModal;