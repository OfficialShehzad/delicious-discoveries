import React from "react";
import { Modal, Box, Typography } from "@mui/material";
import RecipeForm from "../blog/RecipeForm";

const AddRecipeModal = ({
  open,
  handleClose,
  handleModalClose,
  recipe,
  isEdit = false,
}) => {
  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: "90%", md: "60%" },
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
        <Typography variant="h6" component="h2" gutterBottom>
          Add a New Recipe
        </Typography>

        <RecipeForm
          recipe={recipe}
          isEdit={isEdit}
          handleModalClose={() => {
            handleClose();
            handleModalClose();
          }}
        />
      </Box>
    </Modal>
  );
};

export default AddRecipeModal;
