// src/Recipes.js
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function Recipes() {
  const location = useLocation();
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    const ingredients = new URLSearchParams(location.search).get('ingredients');
    fetchRecipes(ingredients);
  }, [location]);

  const fetchRecipes = async (ingredients) => {
    // Replace with a call to your AI recipe generator API
    const response = await fetch(`https://your-api-url?ingredients=${ingredients}`);
    const data = await response.json();
    setRecipes(data.recipes);
  };

  return (
    <div className="recipes">
      <h1>Recipes</h1>
      {recipes.map((recipe, index) => (
        <div key={index} className="recipe">
          <img src={recipe.image} alt={recipe.title} />
          <h2>{recipe.title}</h2>
          <ol>
            {recipe.instructions.map((step, index) => (
              <li key={index}>{step}</li>
            ))}
          </ol>
        </div>
      ))}
    </div>
  );
}

export default Recipes;
