import {
  Autocomplete,
  Box,
  Button,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import trainingTypesStore from "../common/store/trainingTypes.store";
import * as yup from "yup";
import { Controller, type SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { type CaloriesBurnInput } from "../common/types";
import { calculateCaloriesBurn } from "../services/geminiService";
import CircularProgress from "@mui/material/CircularProgress";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import AccessAlarmOutlinedIcon from "@mui/icons-material/AccessAlarmOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import HeightRoundedIcon from "@mui/icons-material/HeightRounded";
import MonitorWeightOutlinedIcon from "@mui/icons-material/MonitorWeightOutlined";

const CalculateCalories = observer(() => {
  const { types, fetchTrainingTypes } = trainingTypesStore;

  useEffect(() => {
    // Load training types on mount so the dropdown + validation have options.
    fetchTrainingTypes();
  }, []);

  const schema = yup.object({
    type: yup
      .string()
      .required("trainingType is required")
      .oneOf(types, "invalid training type"),
    trainingLength: yup.number().required("trainingLength is required").min(1),
    age: yup.number().required("age is required").min(1),
    height: yup.number().required("height is required").min(1),
    weight: yup.number().required("weight is required").min(1),
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CaloriesBurnInput>({
    values: {
      type: "",
      trainingLength: 0,
      age: 0,
      height: 0,
      weight: 0,
    },
    resolver: yupResolver(schema),
  });

  const [geminiRes, setGeminiRes] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(false);

  const calculateCalories: SubmitHandler<CaloriesBurnInput> = async (data) => {
    // Submit the form, show a loader, and render the response (or an error).
    setIsLoading(true);
    setGeminiRes(undefined);

    try {
      const res = await calculateCaloriesBurn(
        data.type,
        data.trainingLength,
        data.height,
        data.weight,
        data.age
      );
      setGeminiRes(res);
    } catch (err) {
      setGeminiRes("Something went wrong, please try again");
    } finally {
      setIsLoading(false);
    }
  };

  const clearForm = () => {
    // Clear inputs and reset the displayed result.
    reset();
    setGeminiRes(undefined);
  };

  return (
    <Stack sx={{ p: 6, alignItems: "center" }} spacing={5}>
      <Typography variant="h3">Calculate calories burn:</Typography>

      <form onSubmit={handleSubmit(calculateCalories)} style={{ width: "80%" }}>
        <Stack spacing={4} alignItems="center">
          <Stack
            sx={{
              width: "30vh",
              display: "flex",
              gap: 2,
              alignItems: "center",
            }}
          >
            <Controller
              name="type"
              control={control}
              render={({ field: { onChange, value } }) => (
                <Autocomplete
                  value={value || ""}
                  onChange={(_event, newValue) => onChange(newValue ?? "")}
                  options={[...types, ""]}
                  fullWidth
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="type"
                      placeholder="type"
                      error={!!errors.type}
                      helperText={errors.type?.message}
                      InputProps={{
                        ...params.InputProps,
                        startAdornment: (
                          <InputAdornment position="start">
                            <FitnessCenterIcon />
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
                />
              )}
            />

            <Controller
              name="trainingLength"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  type="number"
                  error={!!errors.trainingLength}
                  fullWidth
                  label="training length (minutes)"
                  placeholder="training length"
                  helperText={errors.trainingLength?.message}
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <AccessAlarmOutlinedIcon />
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
          </Stack>

          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              gap: 3,
            }}
          >
            <Button
              type="submit"
              variant="contained"
              sx={{
                color: "white",
                backgroundColor: "primary.main",
                ":hover": { backgroundColor: "primary.main" },
                width: "15vh",
                height: "6vh",
              }}
            >
              <Typography variant="h6">Calculate</Typography>
            </Button>

            <Button
              variant="contained"
              onClick={clearForm}
              sx={{
                color: "white",
                background: "#ff9800",
                ":hover": { backgroundColor: "#ff9800" },
                width: "15vh",
                height: "6vh",
              }}
            >
              <Typography variant="h6">Clear</Typography>
            </Button>
          </Box>

          {isLoading && (
            <Box sx={{ display: "flex" }}>
              <CircularProgress size="3rem" />
            </Box>
          )}

          <Box>
            <Typography variant="h4" fontWeight="bold">
              {geminiRes}
            </Typography>
          </Box>
        </Stack>
      </form>
    </Stack>
  );
});

export default CalculateCalories;
