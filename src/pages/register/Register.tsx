import { useNavigate } from "react-router-dom";
import { Grid, Typography, Stack, Button, Box } from "@mui/material";
import RegisterForm from "./RegisterForm";
import { config } from "../../config";

function Register() {
  const navigate = useNavigate();

  const signIn = () => {
    navigate("/login");
  };

  return (
    <>
      <Typography
        variant="h2"
        sx={{
          fontWeight: "bold",
          position: "absolute",
          left: 50,
          top: 10,
          zIndex: "50",
        }}
      >
        TrainUp
      </Typography>
      <Typography
        variant="h4"
        sx={{
          width: "40vw",
          fontWeight: "bold",
          position: "absolute",
          left: 50,
          bottom: 300,
          zIndex: "50",
        }}
      >
        TrainUp is the place to share training experiences with your friends.
      </Typography>
      <Grid container sx={{ height: "100vh" }}>
        <Grid
          item
          md={7}
          sx={{
            backgroundImage: `url(${config.publicFolderUrl}enjoy-food.jpg)`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: "0.8",
            minHeight: "100vh",
            maxHeight: "100vh",
          }}
        />
        <Grid item md={5} sx={{ p: 6 }}>
          <Stack sx={{ position: "relative" }}>
            <Typography variant="h4" sx={{ fontWeight: "bold" }}>
              Create an account
            </Typography>
            <Typography variant="subtitle1" sx={{ color: "secondary.main" }}>
              Let’s get started
            </Typography>
            <Stack sx={{ mt: 6, alignItems: "center" }} spacing={3}>
              <RegisterForm />
            </Stack>
          </Stack>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              mt: 2,
            }}
          >
            <Typography variant="subtitle1" sx={{ color: "secondary.main" }}>
              Already have an account?
            </Typography>
            <Button onClick={signIn}>
              <Typography
                variant="subtitle1"
                sx={{ color: "primary.main", ml: 1 }}
              >
                Sign in
              </Typography>
            </Button>
          </Box>
        </Grid>
      </Grid>
    </>
  );
}

export default Register;
