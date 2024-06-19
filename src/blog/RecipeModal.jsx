import React, { useState } from "react";
import { Modal, Box, Typography, Grid, Chip, Button } from "@mui/material";
import { useAuth } from "../context/AuthContext";
import AddRecipeModal from "../components/AddRecipeModal";
import HandleDeleteModal from "../components/HandleDeleteModal";
import { deleteRecipe } from "../FirestoreService";
import { useSnackbar } from "notistack";
import { useRecipe } from "../context/RecipeContext";

const RecipeModal = ({ recipe, open, handleClose }) => {
  const { user } = useAuth();
  const { recipes, setRecipes } = useRecipe();
  const { enqueueSnackbar } = useSnackbar();
  const [showAddRecipeModal, setShowAddRecipeModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleModalClose = () => {
    setShowAddRecipeModal(false);
  };

  const handleDeleteRecipe = () => {
    setIsDeleting(true);
    deleteRecipe(recipe.id)
      .then(() => {
        enqueueSnackbar("Recipe deleted successfully", {
          variant: "success",
          anchorOrigin: { horizontal: "center", vertical: "top" },
        })
        setRecipes((prevRecipies) => [...recipes.filter((r) => r?.id !== recipe?.id)]);
      })
      .catch((error) => {
        enqueueSnackbar(`Error deleting recipe: ${error}`, {
          variant: "error",
          anchorOrigin: { horizontal: "center", vertical: "top" },
        })
      }).finally(() => {
        setShowDeleteModal(false);
        handleClose();
      });
  };

  return (
    recipe && (
      <>
        <Modal open={open} onClose={handleClose}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: { xs: "90%", md: "70%" },
              maxHeight: "70%",
              overflowY: "auto",
              bgcolor: "#b3b4bd",
              boxShadow: 24,
              px: 4,
              py: 2,
              borderRadius: 2,
              outline: "none",
            }}
          >
            <Box
              sx={{
                display: "flex",
                width: "100%",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography variant="h3" gutterBottom sx={{ fontWeight: "600" }}>
                {recipe?.name}
              </Typography>

              {user && user.uid === recipe.user_id && (
                <Box sx={{ display: "flex", gap: 1 }}>
                  <Button
                    color="info"
                    variant="contained"
                    onClick={() => {
                      setShowAddRecipeModal(true);
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    color="error"
                    variant="contained"
                    onClick={() => {
                      setShowDeleteModal(true);
                    }}
                  >
                    Delete
                  </Button>
                </Box>
              )}
            </Box>

            <Grid container spacing={1} mb={2}>
              {recipe?.images?.map((imgUrl) => (
                <Grid item xs={6} md={3}>
                  <img
                    src={imgUrl}
                    alt={`${recipe.name}`}
                    width="100%"
                    style={{ borderRadius: "8px", maxHeight: "250px" }}
                  />
                </Grid>
              ))}
            </Grid>

            <Typography variant="h5" gutterBottom sx={{ fontWeight: "600" }}>
              Ingredients
            </Typography>
            <Box sx={{ mb: 2, display: "flex", gap: 1 }}>
              {recipe &&
                Object?.keys(recipe?.ingredients).map((ingredient) => (
                  <Chip
                    variant="filled"
                    color="primary"
                    size="medium"
                    key={ingredient}
                    label={
                      <>
                        {ingredient} - <i>{recipe?.ingredients[ingredient]}</i>
                      </>
                    }
                  />
                ))}
            </Box>

            <Typography variant="h5" gutterBottom sx={{ fontWeight: "600" }}>
              Instructions
            </Typography>
            <Typography gutterBottom>{recipe?.instructions}</Typography>
          </Box>
        </Modal>
        <AddRecipeModal
          isEdit={true}
          recipe={recipe}
          open={showAddRecipeModal}
          handleClose={handleModalClose}
          handleModalClose={handleClose}
        />
        <HandleDeleteModal
          open={showDeleteModal}
          handleClose={() => {
            setShowDeleteModal(false);
          }}
          onSuccess={() => {
            handleDeleteRecipe();
          }}
          isDeleting={isDeleting}
        />
      </>
    )
  );
};

export default RecipeModal;
