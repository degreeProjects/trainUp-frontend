import { useNavigate } from "react-router-dom";
import { Stack, Typography, Button, Box, Paper } from "@mui/material";
import RegisterForm from "./RegisterForm";

/**
 * Registration page shell.
 * Renders the full-page gradient background, a welcome heading, the RegisterForm,
 * and a "Already have an account? Sign in" link that navigates to /login.
 */
function Register() {
  const navigate = useNavigate();

  const signIn = () => {
    navigate("/login");
  };

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        background:
          "linear-gradient(180deg, #ffffff 0%, #e0f7ff 50%, #0d47a1 100%)",
        p: 3,
        overflowY: "auto",
      }}
    >
      <Typography
        variant="h3"
        sx={{
          fontWeight: "bold",
          mt: 2,
          textAlign: "center",
        }}
      >
        Welcome to TrainUp
      </Typography>

      <Paper
        elevation={6}
        sx={{
          width: "100%",
          maxWidth: 550,
          p: 4,
          borderRadius: 4,
          mt: 2,
          backgroundColor: "white",
          textAlign: "center",
          boxSizing: "border-box",
        }}
      >
        <Typography variant="subtitle1" sx={{ mb: 3, color: "text.secondary" }}>
          Share your training experiences with friends
        </Typography>
        <Box
          sx={{
            width: "100%",
            "& .MuiFormControl-root": { width: "100%" },
          }}
        >
          <RegisterForm />
        </Box>
      </Paper>

      <Stack
        direction="row"
        justifyContent="center"
        alignItems="center"
        spacing={1}
        sx={{ mb: 5, mt: 2 }}
      >
        <Typography variant="body1" sx={{ color: "text.secondary" }}>
          Already have an account?
        </Typography>
        <Button onClick={signIn} sx={{ textTransform: "none" }}>
          <Typography variant="body1" sx={{ color: "white" }}>
            Sign in
          </Typography>
        </Button>
      </Stack>
    </Box>
  );
}

export default Register;
