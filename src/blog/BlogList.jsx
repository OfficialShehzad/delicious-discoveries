import React, { useEffect, useState } from "react";
import { getRecipes } from "../FirestoreService";
import { Box, Grid, Typography } from "@mui/material";
import RecipeModal from "./RecipeModal";
import { useRecipe } from "../context/RecipeContext";
import { useAuth } from "../context/AuthContext";

const BlogList = () => {
  const { user } = useAuth();
  const { recipes, setRecipes, recipeFilters } = useRecipe();
  const [showRecipeModal, setShowRecipeModal] = useState(false);
  const [clickedRow, setClickedRow] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleModalClose = () => {
    setShowRecipeModal(false);
  };

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      const recipesList = await getRecipes(recipeFilters, user);
      setRecipes(recipesList);
      setIsLoading(false);
    };

    fetchUsers();
  }, [recipeFilters, user, setRecipes]);

  return (
    <Box sx={{ display: "flex" }}>
      <Grid container spacing={2} sx={{ width: "100%" }}>
        {isLoading ? (
          <Grid
            item
            xs={12}
            sx={{
              height: "300px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography sx={{ fontSize: "42px" }}>
              Recipes Loading...
            </Typography>
          </Grid>
        ) : recipes?.length > 0 ? (
          recipes?.map((recipe) => (
            <Grid item xs={12} sm={4} md={3} lg={2}>
              <Box
                key={recipe?.name}
                onClick={() => {
                  setClickedRow(recipe);
                  setShowRecipeModal(true);
                }}
                sx={{
                  cursor: "pointer",
                  // backgroundColor: user && user?.uid === recipe?.user_id ? '#d3d9d4' : '#fff',
                  backgroundColor: "#fff",
                  height: "250px",
                  boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
                }}
              >
                <img
                  src={recipe?.images?.length > 0 ? recipe?.images[0] : ""}
                  alt="recipe_image"
                  style={{ width: "100%", height: "100px", objectFit: "fill" }}
                />
                <Typography
                  sx={{
                    fontSize: "20px",
                    padding: "8px 12px",
                    fontWeight: "800",
                    textAlign: "left",
                  }}
                >
                  {recipe?.name}
                </Typography>

                <Typography
                  sx={{
                    fontSize: "12px",
                    padding: "0px 12px 8px",
                    fontWeight: "800",
                    textAlign: "left",
                    color: "#00000080",
                  }}
                >
                  {recipe?.instructions?.length > 60
                    ? recipe?.instructions?.substr(0, 65) + "..."
                    : recipe?.instructions}
                </Typography>
              </Box>
            </Grid>
          ))
        ) : (
          <Grid
            item
            xs={12}
            sx={{
              height: "300px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography sx={{ fontSize: "42px" }}>
              No recipes to show
            </Typography>
          </Grid>
        )}
      </Grid>

      <RecipeModal
        recipe={clickedRow}
        open={showRecipeModal}
        handleClose={handleModalClose}
      />
    </Box>
  );
};

export default BlogList;
