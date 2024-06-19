// AuthContext.js
import React, { createContext, useContext, useState } from 'react';


const RecipeContext = createContext();

export const RecipeProvider = ({ children }) => {
  const [recipes, setRecipes] = useState(null);
  const [recipeFilters, setRecipeFilters] = useState({
    mine: false,
    all: true,
    searchQuery: "",
  })

  return (
    <RecipeContext.Provider value={{ recipes, setRecipes, recipeFilters, setRecipeFilters }}>
      {children}
    </RecipeContext.Provider>
  );
};

export const useRecipe = () => useContext(RecipeContext);
