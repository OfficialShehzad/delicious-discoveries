import React, { useState } from "react";
import SignIn from "../SignIn";
import { useAuth } from "../context/AuthContext";
import { Box, Button, Typography } from "@mui/material";
import AddRecipeModal from "./AddRecipeModal";
import AddIcon from "@mui/icons-material/Add";

const Nav = () => {
  const { user } = useAuth();
  const [showAddRecipeModal, setShowAddRecipeModal] = useState(false);

  const handleModalClose = () => {
    setShowAddRecipeModal(false);
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "2rem",
          backgroundColor: "#b3b4bd",
          padding: "1rem 10%",
        }}
      >
        {user && (
          <Box sx={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <img
              src={user?.photoURL}
              alt="profile_image"
              width="50px"
              style={{ borderRadius: "50%" }}
            />
            <Typography>Hi, {user?.displayName}</Typography>
          </Box>
        )}

        <Box sx={{ display: "flex", alignItems: "center", gap: "1rem", flexDirection: { xs: 'column-reverse', md: 'row' } }}>
          {user && (
              <Button
                variant="outlined"
                color="primary"
                onClick={() => setShowAddRecipeModal((prevValue) => !prevValue)}
                endIcon={<AddIcon />}
                sx={{ whiteSpace: 'nowrap' }}
              >
                Add Recipe
              </Button>
          )}
          <SignIn />
        </Box>
      </Box>

      <AddRecipeModal
        open={showAddRecipeModal}
        handleClose={handleModalClose}
      />
    </>
  );
};

export default Nav;
