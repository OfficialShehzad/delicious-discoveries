import React from "react";
import { useAuth } from "../context/AuthContext";
import BlogList from "./BlogList";
import RecipeForm from "./RecipeForm";
import { Box, Typography } from "@mui/material";
import Filters from '../components/Filters'

const HomePage = () => {
  const { user } = useAuth();

  return (
    <Box sx={{ margin: '0 10%' }}>
      <Typography sx={{ fontSize: {xs: '36px', md: '50px'}, fontWeight: '600' }}>Delicious Discoveries: Explore Our Recipe Collection!</Typography>

      <Filters />

      <BlogList />
    </Box>
  );
};

export default HomePage;
