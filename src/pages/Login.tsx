import { useNavigate } from "react-router-dom";
import { useForm, Controller, type SubmitHandler } from "react-hook-form";
import {
  Typography,
  Button,
  TextField,
  InputAdornment,
  Stack,
  Box,
  Paper,
} from "@mui/material";
import HorizontalLineWithText from "../components/HorizontalLineWithText";
import authService from "../services/authService";
import usersService from "../services/userService";
import GoogleAuth from "../components/GoogleAuth";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";

interface LoginFormInput {
  email: string;
  password: string;
}

const schema = yup.object({
  email: yup.string().required("email is required"),
  password: yup.string().required("password is requird"),
});

function Login() {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInput>({
    values: {
      email: "",
      password: "",
    },
    resolver: yupResolver(schema),
  });

  const register = () => {
    navigate("/register");
  };

  const login: SubmitHandler<LoginFormInput> = async (data) => {
    const { request: loginRequest } = authService.login(data);

    try {
      const res = await loginRequest;
      document.cookie = `access_token=${res.data.accessToken}; path=/`;
      document.cookie = `refresh_token=${res.data.refreshToken}; path=/`;

      const { request: getMeRequest } = usersService.getMe();

      await getMeRequest;
      navigate("/");
    } catch (err: any) {
      if (err.response.status === 401) {
        setServerError("some of the details are incorrect");
      }
    }
  };

  return (
    <Stack
      sx={{
        minHeight: "100vh",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(to bottom right, #0d47a1, #1976d2)",
      }}
    >
      <Paper
        elevation={15}
        sx={{
          width: "80%",
          maxWidth: 550,
          borderRadius: 4,
          p: 6,
          textAlign: "center",
          bgcolor: "white",
        }}
      >
        <Box display="flex" alignItems="center" justifyContent="center" mb={4}>
          <Typography variant="h3" sx={{ fontWeight: "800", mr: 1 }}>
            TrainUp
          </Typography>
          <FitnessCenterIcon sx={{ fontSize: "3rem", color: "primary.main" }} />
        </Box>

        <Typography variant="h5" sx={{ mb: 4, fontWeight: 500 }}>
          Login to Your Account
        </Typography>

        <form onSubmit={handleSubmit(login)}>
          <Stack spacing={3}>
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Email"
                  placeholder="Enter your email"
                  fullWidth
                  variant="outlined"
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailOutlinedIcon color="primary" />
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            />

            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  type="password"
                  label="Password"
                  placeholder="Enter your password"
                  fullWidth
                  variant="outlined"
                  error={!!errors.password}
                  helperText={errors.password?.message}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockOutlinedIcon color="primary" />
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            />

            <Button
              type="submit"
              variant="contained"
              sx={{
                py: 1.5,
                fontSize: "1.1rem",
                fontWeight: "bold",
              }}
            >
              Login
            </Button>

            {serverError && (
              <Typography color="error" fontWeight="bold" textAlign="center">
                {serverError}
              </Typography>
            )}
          </Stack>
        </form>

        <Box mt={4}>
          <HorizontalLineWithText text="OR" />
        </Box>

        <Button
          variant="outlined"
          onClick={register}
          sx={{
            mt: 2,
            width: "100%",
            borderRadius: 2,
            py: 1.4,
            fontWeight: "bold",
          }}
        >
          Create a New Account
        </Button>

        <Box mt={3} display="flex" justifyContent="center">
          <GoogleAuth />
        </Box>
      </Paper>
    </Stack>
  );
}

export default Login;
