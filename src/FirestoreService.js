// src/FirestoreService.js
import {
  db,
  collection,
  addDoc,
  getDocs,
  query,
  where,
  doc,
  updateDoc,
  deleteDoc,
} from "./firebase";

const getRecipes = async (filters, user) => {
  const recipesCollection = collection(db, "recipes");

  let q = query(recipesCollection);

  if (filters?.mine) {
    q = query(q, where("user_id", "==", user?.uid));
  }

  if (!user) {
    q = query(q, where("is_public", "==", true));
  }
  
  const querySnapshot = await getDocs(q);
  let recipes = [];
  querySnapshot.forEach((doc) => {
    recipes.push({ id: doc.id, ...doc.data() });
  });

  // Filter by searchQuery client-side
  if (filters?.searchQuery && filters.searchQuery !== "") {
    const searchQueryLower = filters.searchQuery.toLowerCase();
    recipes = recipes.filter((recipe) =>
      recipe.name.toLowerCase().includes(searchQueryLower)
    );
  }

  return recipes;
};

// Function to add a recipe to Firestore
const addRecipe = async (recipe) => {
  try {
    const docRef = await addDoc(collection(db, "recipes"), recipe);
    console.log("Document written with ID: ", docRef.id);
    return docRef.id;
  } catch (e) {
    console.error("Error adding document: ", e);
    throw new Error("Error adding recipe");
  }
};

// Function to edit a recipe in Firestore
const editRecipe = async (recipeId, updatedRecipe) => {
  try {
    const recipeRef = doc(db, "recipes", recipeId);
    await updateDoc(recipeRef, updatedRecipe);
    console.log("Document updated with ID: ", recipeId);
  } catch (e) {
    console.error("Error updating document: ", e);
    throw new Error("Error updating recipe");
  }
};

// Function to delete a recipe from Firestore
const deleteRecipe = async (recipeId) => {
  try {
    const recipeRef = doc(db, "recipes", recipeId);
    await deleteDoc(recipeRef);
    console.log("Document deleted with ID: ", recipeId);
  } catch (e) {
    console.error("Error deleting document: ", e);
    throw new Error("Error deleting recipe");
  }
};

export { getRecipes, addRecipe, editRecipe, deleteRecipe };
