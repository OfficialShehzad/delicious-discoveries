import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useRecipe } from "../context/RecipeContext";
import { useAuth } from "../context/AuthContext";
import SearchIcon from "@mui/icons-material/Search";
import { useDebounce } from "use-debounce";

const Filters = () => {
  const { recipeFilters, setRecipeFilters } = useRecipe();
  const { user } = useAuth();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm] = useDebounce(searchTerm, 2000);

  useEffect(() => {
    setRecipeFilters((prevValues) => ({...prevValues, searchQuery: debouncedSearchTerm,}))
  }, [debouncedSearchTerm, setRecipeFilters])

  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: "1rem",
          my: "1rem",
        }}
      >
        <Typography>Search : </Typography>
        <TextField
          placeholder="Search recipe"
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>
      {user && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            mb: "1.5rem",
          }}
        >
          <Typography>Filters : </Typography>
          <Button
            color="primary"
            variant={recipeFilters?.mine ? "contained" : "outlined"}
            onClick={() =>
              setRecipeFilters((prevValues) => ({
                ...prevValues,
                mine: !prevValues.mine,
              }))
            }
          >
            My Recipes
          </Button>
        </Box>
      )}
    </>
  );
};

export default Filters;
