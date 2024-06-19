import "./index.css";
import Nav from "./components/Nav";
import { AuthProvider } from "./context/AuthContext";
import { RecipeProvider } from "./context/RecipeContext";
import HomePage from "./blog/HomePage";
import { SnackbarProvider } from "notistack";

function App() {
  return (
    <AuthProvider>
      <SnackbarProvider>
        <RecipeProvider>
          <Nav />
          <HomePage />
        </RecipeProvider>
      </SnackbarProvider>
    </AuthProvider>
  );
}

export default App;
