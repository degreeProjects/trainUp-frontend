import {
  Autocomplete,
  Box,
  Button,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import ProfileAvatarInput from "../components/ProfileAvatarInput";
import { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router-dom";
import usersService from "../services/userService";
import userStore from "../common/store/user.store";
import { fetchImageAndConvertToFile } from "../common/utils/fetch-image";
import * as yup from "yup";
import { Controller, type SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { type EditProfileFormInput } from "../common/types";
import citiesStore from "../common/store/cities.store";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import HeightRoundedIcon from "@mui/icons-material/HeightRounded";
import MonitorWeightOutlinedIcon from "@mui/icons-material/MonitorWeightOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";

const schema = yup.object({
  fullName: yup.string().required("fullName is required"),
  homeCity: yup.string().optional(),
  height: yup.number().required("height is required").min(1, "height must be positive"),
  weight: yup.number().required("weight is required").min(1, "weight must be positive"),
  age: yup.number().required("age is required").min(1, "age must be positive"),
});

const EditProfile = observer(() => {
  const { user, setUser } = userStore;
  const { cities, fetchCities } = citiesStore;
  const navigate = useNavigate();

  useEffect(() => {
    fetchCities();
  }, [fetchCities]);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<EditProfileFormInput>({
    values: {
      fullName: user?.fullName ?? "",
      homeCity: user?.homeCity ?? "",
      height: user?.height ?? 170,
      weight: user?.weight ?? 70,
      age: user?.age ?? 25,
    },
    resolver: yupResolver(schema),
  });

  const [profileImage, setProfileImage] = useState<File | undefined>();

  useEffect(() => {
    if (user?.profileImage) {
      // The avatar widget expects a File, so fetch the stored filename and turn
      // it back into a File to enable recropping or immediate re-upload.
      fetchImageAndConvertToFile(user?.profileImage).then((file) => {
        setProfileImage(file);
      });
    }
  }, [user]);

  const editProfile: SubmitHandler<EditProfileFormInput> = async (data) => {
    const { request: editProfileRequest } = usersService.editProfile({
      ...data,
      picture: profileImage,
    });

    try {
      const res = await editProfileRequest;
      setUser(res.data);
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  };

  const cancelEdit = () => {
    navigate("/");
  };

  return (
    <Stack sx={{ p: 10, alignItems: "center" }} spacing={5}>
      <ProfileAvatarInput
        changeProfileImage={setProfileImage}
        profileImage={profileImage}
        width={280}
        height={280}
      />
      <form onSubmit={handleSubmit(editProfile)} style={{ width: "80%" }}>
        <Stack spacing={4} alignItems="center">
          <Controller
            name="fullName"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                error={!!errors.fullName}
                fullWidth
                label="fullName"
                sx={{ width: "25vw" }}
                placeholder="email"
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
                style={{ marginBottom: 10, width: "25vw" }}
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
                  />
                )}
                sx={{
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
                sx={{ width: "25vw" }}
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
                sx={{ width: "25vw" }}
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
                sx={{ width: "25vw" }}
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
          <Box
            sx={{
              display: "flex",
              width: "30%",
              justifyContent: "center",
              gap: 2,
            }}
          >
            <Button
              type="submit"
              variant="contained"
              sx={{
                color: "white",
                backgroundColor: "primary.main",
                ":hover": { backgroundColor: "primary.main" },
                width: "50%",
                height: "6vh",
                mt: 3,
              }}
            >
              <Typography variant="h6" fontWeight="bold">
                Save Profile
              </Typography>
            </Button>
            <Button
              variant="contained"
              onClick={cancelEdit}
              sx={{
                color: "white",
                background: "#ff9800",
                ":hover": { backgroundColor: "#ff9800" },
                width: "50%",
                height: "6vh",
                mt: 3,
              }}
            >
              <Typography variant="h6" fontWeight="bold">
                Cancel
              </Typography>
            </Button>
          </Box>
        </Stack>
      </form>
    </Stack>
  );
});

export default EditProfile;
