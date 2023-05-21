const dotenv = require("dotenv");
dotenv.config();
console.log("API Key: ", process.env.OPENAI_API_KEY);

const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
const port = 3001;

app.use(cors());

app.get("/generate-recipe", async (req, res) => {
  try {
    const ingredients = req.query.ingredients;
    const prompt = `Create a recipe with a unique name using the following ingredients:\n${ingredients}\n\nPlease provide the recipe in the following format:\n\nRecipe Name:\n\n{{Recipe Name}}\n\nIngredients:\n{{Ingredients}}\n\nInstructions:\n{{Instructions}}\n`;

    console.log("Sending request to OpenAI API...");

    let response;
    try {
      response = await axios.post(
        "https://api.openai.com/v1/engines/text-davinci-002/completions",
        {
          prompt: prompt,
          max_tokens: 250,
          n: 1,
          stop: null,
          temperature: 0.8,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          },
        }
      );
    } catch (error) {
      console.error("Error calling OpenAI API:", error);
      return res
        .status(500)
        .json({error: `Error calling OpenAI API: ${error.toString()}`});
    }

    console.log("Received response:", response);

    const recipeText = response.data.choices[0].text.trim();

    const recipeParts = recipeText.split("\n\n");
    if (recipeParts.length === 3) {
      const namePart = recipeParts[0];
      const ingredientsPart = recipeParts[1];
      const instructionsPart = recipeParts[2];

      const recipeName = namePart.replace(/^Recipe Name:\n/, "").trim();
      const recipeIngredients = ingredientsPart
        .replace(/^Ingredients:\n/, "")
        .trim()
        .split("\n");
      const recipeInstructions = instructionsPart
        .replace(/^Instructions:\n/, "")
        .trim()
        .split("\n");

      const recipeData = {
        name: recipeName,
        ingredients: recipeIngredients,
        instructions: recipeInstructions,
      };

      res.send(recipeData);
    } else {
      res.status(500).json({error: "Error parsing recipe data"});
    }
  } catch (error) {
    console.error("Error generating recipe:", error);
    console.error(
      "Error details:",
      error.response ? error.response.data : null
    );
    res.status(500).json({error: `Error generating recipe: ${error.toString()}`});
  }
});

app.get("/search-ingredients", async (req, res) => {
  try {
    const searchTerm = req.query.q;
    const ingredientApiUrl = `https://api.spoonacular.com/food/ingredients/search?apiKey=${process.env.SPOONACULAR_API_KEY}&query=${searchTerm}`;

    const response = await axios.get(ingredientApiUrl);

    res.send(response.data.results);
  } catch (error) {
    console.error("Error calling OpenAI API:", error);
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.log(error.response.data);
      console.log(error.response.status);
      console.log(error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      console.log(error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.log('Error', error.message);
    }
    return res
      .status(500)
      .json({error: `Error calling OpenAI API: ${error.toString()}`});
  }  
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
