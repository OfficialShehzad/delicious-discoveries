import React from "react";
import { useAuth } from "./context/AuthContext";
import { Button, Typography } from "@mui/material";

const SignIn = () => {
  const { signIn, user, logOut } = useAuth();
  return (
    <div>
      {user ? (
        <Button color="error" variant="contained" onClick={logOut}>
          Logout
        </Button>
      ) : (
        <Typography sx={{ fontSize: '24px' }}>
          <Button color="primary" variant="contained" onClick={signIn}>
            Sign in with Google
          </Button>{" "}
          to add your own recipes!
        </Typography>
      )}
    </div>
  );
};

export default SignIn;
