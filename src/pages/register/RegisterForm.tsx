import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import HeightRoundedIcon from "@mui/icons-material/HeightRounded";
import MonitorWeightOutlinedIcon from "@mui/icons-material/MonitorWeightOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import {
  Autocomplete,
  Button,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import * as yup from "yup";
import { Controller, type SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import type { RegisterFormInput } from "../../common/types";
import authService from "../../services/authService";
import userStore from "../../common/store/user.store";
import ProfileAvatarInput from "../../components/ProfileAvatarInput";
import { observer } from "mobx-react-lite";
import citiesStore from "../../common/store/cities.store";

/**
 * Controlled registration form.
 * Handles email, password, full name, home city, and profile image.
 * Validates input with Yup + react-hook-form, submits via authService.register,
 */
const schema = yup.object({
  email: yup
    .string()
    .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "email must be a valid email")
    .required("email is required"),
  password: yup.string().required("password is requird"),
  fullName: yup.string().required("fullName is required"),
  homeCity: yup.string().optional(),
  height: yup.number().required("height is required").min(1, "height must be positive"),
  weight: yup.number().required("weight is required").min(1, "weight must be positive"),
  age: yup.number().required("age is required").min(1, "age must be positive"),
});

const RegisterForm = observer(() => {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");
  const [profileImage, setProfileImage] = useState<File | undefined>();
  const { cities, fetchCities } = citiesStore;

  useEffect(() => {
    // Cities list comes from an external dataset; pull it once and share through
    // the MobX store so every autocomplete stays in sync.
    fetchCities();
  }, [fetchCities]);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormInput>({
    values: {
      email: "",
      password: "",
      fullName: "",
      homeCity: "",
      height: 170,
      weight: 70,
      age: 25,
    },
    resolver: yupResolver(schema),
  });

  const createAccount: SubmitHandler<RegisterFormInput> = async (data) => {
    const { request: register } = authService.register({
      ...data,
      picture: profileImage,
    });

    try {
      const res = await register;

      // Backend returns tokens on register — use them directly
      document.cookie = `access_token=${res.data.accessToken}; path=/`;
      document.cookie = `refresh_token=${res.data.refreshToken}; path=/`;
      userStore.setUser(res.data.user);

      navigate("/");
    } catch (err: any) {
      if (err.response?.status === 409) {
        setServerError(err.response.data);
      }

      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit(createAccount)}>
      <Stack spacing={4} alignItems="center">
        <ProfileAvatarInput
          changeProfileImage={setProfileImage}
          profileImage={profileImage}
          width={180}
          height={180}
        />
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              error={!!errors.email}
              fullWidth
              label="email"
              sx={{ width: "30vw" }}
              placeholder="email"
              helperText={errors.email?.message}
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailOutlinedIcon />
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
              error={!!errors.password}
              fullWidth
              label="password"
              sx={{ width: "30vw" }}
              placeholder="password"
              type="password"
              helperText={errors.password?.message}
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlinedIcon />
                  </InputAdornment>
                ),
              }}
            />
          )}
        />
        <Controller
          name="fullName"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              error={!!errors.fullName}
              fullWidth
              label="fullName"
              sx={{ width: "30vw" }}
              placeholder="fullName"
              helperText={errors.fullName?.message}
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonOutlineIcon />
                  </InputAdornment>
                ),
              }}
            />
          )}
        />
        <Controller
          name="homeCity"
          control={control}
          render={({ field, formState: { errors } }) => (
            <Autocomplete
              style={{ marginBottom: 10, width: "100%" }}
              {...field}
              options={cities}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="city"
                  error={!!errors.homeCity}
                  helperText={errors.homeCity?.message}
                  placeholder="city"
                  InputProps={{
                    ...params.InputProps,
                    startAdornment: (
                      <InputAdornment position="start">
                        <HomeOutlinedIcon />
                      </InputAdornment>
                    ),
                  }}
                  fullWidth
                />
              )}
              sx={{
                width: "100%",
                mb: 2,
                "& .MuiOutlinedInput-root": {
                  pl: 1.75,
                  pt: 1,
                  pb: 1,
                },
                "& .MuiOutlinedInput-root .MuiAutocomplete-input": {
                  pl: 0,
                },
              }}
              onChange={(_, data) => field.onChange(data)}
            />
          )}
        />
        <Controller
          name="height"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              type="number"
              error={!!errors.height}
              fullWidth
              label="height (cm)"
              sx={{ width: "30vw" }}
              placeholder="height"
              helperText={errors.height?.message}
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <HeightRoundedIcon />
                  </InputAdornment>
                ),
                inputProps: { min: 0 },
              }}
            />
          )}
        />
        <Controller
          name="weight"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              type="number"
              error={!!errors.weight}
              fullWidth
              label="weight (kg)"
              sx={{ width: "30vw" }}
              placeholder="weight"
              helperText={errors.weight?.message}
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <MonitorWeightOutlinedIcon />
                  </InputAdornment>
                ),
                inputProps: { min: 0 },
              }}
            />
          )}
        />
        <Controller
          name="age"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              type="number"
              error={!!errors.age}
              fullWidth
              label="age"
              sx={{ width: "30vw" }}
              placeholder="age"
              helperText={errors.age?.message}
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <CalendarMonthOutlinedIcon />
                  </InputAdornment>
                ),
                inputProps: { min: 0 },
              }}
            />
          )}
        />
        <Button
          variant="contained"
          type="submit"
          sx={{
            color: "white",
            backgroundColor: "primary.main",
            ":hover": { backgroundColor: "primary.main" },
            width: "60%",
            height: "6vh",
            mt: 10,
            mx: "auto",
          }}
        >
          <Typography variant="h6" sx={{ color: "white" }}>
            Create Account
          </Typography>
        </Button>
        {serverError && (
          <Typography variant="body1" color="error" fontWeight="bold">
            {serverError}
          </Typography>
        )}
      </Stack>
    </form>
  );
});

export default RegisterForm;
