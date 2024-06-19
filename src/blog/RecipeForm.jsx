import {
  Box,
  Button,
  Grid,
  TextField,
  IconButton,
  FormControlLabel,
  Switch,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { addRecipe, editRecipe } from "../FirestoreService"; // Import the addRecipe function
import { useAuth } from "../context/AuthContext";
import { useSnackbar } from "notistack";
import { useRecipe } from "../context/RecipeContext";

const RecipeForm = ({ isEdit, recipe, handleModalClose }) => {
  const { user } = useAuth();
  const { recipes, setRecipes } = useRecipe();
  const { enqueueSnackbar } = useSnackbar();
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "ingredients",
  });

  const [imagesBase64, setImagesBase64] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isEdit && recipe) {
      const ingredientsArray = Object.keys(recipe.ingredients).map((name) => ({
        name,
        quantity: recipe.ingredients[name],
      }));

      reset({
        ...recipe,
        ingredients: ingredientsArray,
      });

      setImagesBase64(recipe.images || []);
    }
  }, [isEdit, recipe, reset]);

  const onSubmit = async (data) => {
    setIsLoading(true);
    if (imagesBase64.length === 0) {
      setError("images", {
        type: "manual",
        message: "At least one image is required",
      });
      return;
    }
    if (data.ingredients.length === 0) {
      setError("ingredients", {
        type: "manual",
        message: "At least one ingredient is required",
      });
      return;
    }

    // Transform ingredients into the desired format
    const ingredients = data.ingredients.reduce((acc, curr) => {
      acc[curr.name] = curr.quantity;
      return acc;
    }, {});

    const formData = {
      ...data,
      ingredients,
      images: imagesBase64,
      user_id: user?.uid,
    };

    try {
      if(isEdit) {
        await editRecipe(recipe.id, formData);
        enqueueSnackbar(`Recipe updated successfully`, {
          variant: "success",
          anchorOrigin: { horizontal: "center", vertical: "top" },
        });
        setRecipes((prevRecipes) =>
          prevRecipes.map((r) => (r.id === recipe.id ? formData : r))
        );
        handleModalClose();
      } else {
        const recipeId = await addRecipe(formData);
        enqueueSnackbar(`Recipe added with ID: ${recipeId}`, {
          variant: "success",
          anchorOrigin: { horizontal: "center", vertical: "top" },
        });
        reset();
        setRecipes([...recipes, formData]);
      }
    } catch (e) {
      enqueueSnackbar(`Failed to ${isEdit ? 'edit' : 'add'} recipe: ${e}`, {
        variant: "error",
        anchorOrigin: { horizontal: "center", vertical: "top" },
      });
    } finally {
      setIsLoading(false);
      if(!isEdit){
        delete formData.ingredients; // Remove the original ingredients array
      }
    }
  };

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    const newImages = [];
    if (files.length + imagesBase64.length > 4) {
      alert("You can only upload up to 4 images.");
      return;
    }

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        newImages.push(reader.result);
        if (newImages.length === files.length) {
          setImagesBase64([...imagesBase64, ...newImages]);
          clearErrors("images");
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setImagesBase64(imagesBase64.filter((_, i) => i !== index));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid container justifyContent={"center"} spacing={2}>
        <Grid item xs={12}>
          <TextField
            label="Name"
            {...register("name", { required: "Name is required" })}
            error={!!errors.name}
            helperText={errors.name?.message}
            fullWidth
          />
        </Grid>

        <Grid item xs={12}>
          <input
            accept="image/*"
            type="file"
            multiple
            onChange={handleImageUpload}
            style={{ display: "none" }}
            id="image-upload"
          />
          <label htmlFor="image-upload">
            <Button variant="contained" component="span">
              Upload Images
            </Button>
          </label>
          {errors.images && (
            <p style={{ color: "red" }}>{errors.images.message}</p>
          )}
          <Grid container spacing={2} style={{ marginTop: 10 }}>
            {imagesBase64.map((image, index) => (
              <Grid item key={index}>
                <Box position="relative" display="inline-block">
                  <img
                    src={image}
                    alt={`preview ${index}`}
                    width={100}
                    height={100}
                  />
                  <IconButton
                    size="small"
                    style={{ position: "absolute", top: 0, right: 0 }}
                    onClick={() => removeImage(index)}
                  >
                    <RemoveIcon />
                  </IconButton>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <Typography>Ingredients</Typography>
          {errors.ingredients && (
            <p style={{ color: "red" }}>{errors.ingredients.message}</p>
          )}
          {fields.map((field, index) => (
            <Grid container key={field.id} spacing={1} alignItems="center">
              <Grid item xs={5}>
                <TextField
                  label="Ingredient"
                  {...register(`ingredients[${index}].name`, {
                    required: true,
                  })}
                  error={!!errors.ingredients?.[index]?.name}
                  helperText={errors.ingredients?.[index]?.name && "Required"}
                  fullWidth
                />
              </Grid>
              <Grid item xs={5}>
                <TextField
                  label="Quantity"
                  {...register(`ingredients[${index}].quantity`, {
                    required: true,
                  })}
                  error={!!errors.ingredients?.[index]?.quantity}
                  helperText={
                    errors.ingredients?.[index]?.quantity && "Required"
                  }
                  fullWidth
                />
              </Grid>
              <Grid item xs={2}>
                <IconButton onClick={() => remove(index)}>
                  <RemoveIcon />
                </IconButton>
              </Grid>
            </Grid>
          ))}
          <Button
            variant="outlined"
            onClick={() => {
              append({ name: "", quantity: "" });
              clearErrors("ingredients");
            }}
            startIcon={<AddIcon />}
          >
            Add Ingredient
          </Button>
        </Grid>

        <Grid item xs={12}>
          <TextField
            label="Instructions"
            {...register("instructions", {
              required: "Instructions are required",
            })}
            error={!!errors.instructions}
            helperText={errors.instructions?.message}
            multiline
            rows={4}
            fullWidth
          />
        </Grid>

        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Controller
                name="is_public"
                control={control}
                defaultValue={false}
                render={({ field }) => (
                  <Switch
                    {...field}
                    checked={field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                    color="primary"
                  />
                )}
              />
            }
            label="Make public?"
          />
        </Grid>

        <Grid item xs={12}>
          <Button variant="contained" type="submit" color="primary" disabled={isLoading}>
            {isEdit ? 'Edit' : 'Submit'}
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default RecipeForm;
