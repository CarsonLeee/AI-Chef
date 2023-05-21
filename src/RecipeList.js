import React, { useState } from "react";
import "./RecipeList.css";
import Navbar from "./Navbar";
import robotImage from "./images/robot-image.png";

function RecipeList() {
  const [ingredients, setIngredients] = useState("");
  const [generatedRecipe, setGeneratedRecipe] = useState(null);
  const [loading, setLoading] = useState(false);

  const generateRecipes = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:3001/generate-recipe?ingredients=${encodeURIComponent(
          ingredients
        )}`
      );

      const recipeData = await response.json();

      if (recipeData.error) {
        throw new Error(recipeData.error);
      }

      const recipe = {
        name: recipeData.name,
        ingredients: recipeData.ingredients
          ? recipeData.ingredients.map((ingredient) =>
              ingredient.replace(/^-/, "")
            )
          : [],
        instructions: recipeData.instructions
          ? recipeData.instructions.map((instruction) =>
              instruction.replace(/^\d+\.\s/, "")
            )
          : [],
      };

      setGeneratedRecipe(recipe);
    } catch (error) {
      console.error("Error generating recipe:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    generateRecipes();
  };

  return (
    <>
      <Navbar />
      <div className="App">
        <div className="content-container">
          {loading ? (
            <p>Loading...</p>
          ) : generatedRecipe ? (
            <div className="generated-recipe">
              <h3>Recipe Name:</h3>
              <p>{generatedRecipe.name}</p>
              <h3>Ingredients:</h3>
              <ul>
                {generatedRecipe.ingredients.map((ingredient, index) => (
                  <li key={index}>{ingredient}</li>
                ))}
              </ul>
              <h3>Instructions:</h3>
              <ol>
                {generatedRecipe.instructions.map((instruction, index) => (
                  <li key={index}>{instruction}</li>
                ))}
              </ol>
            </div>
          ) : (
            <img src={robotImage} alt="Robot Chef" className="robot-image" />
          )}
          <div className="form-container">
            <h1>AI Chef</h1>
            <form onSubmit={handleSubmit}>
              <textarea
                value={ingredients}
                onChange={(e) => setIngredients(e.target.value)}
                placeholder="Enter the ingredients you have one per line"
                rows={5}
                cols={50}
              />
              <br />
              <button type="submit" className="generate-button">
                {loading
                  ? "Generating..."
                  : generatedRecipe
                  ? "Regenerate"
                  : "Generate"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default RecipeList;
