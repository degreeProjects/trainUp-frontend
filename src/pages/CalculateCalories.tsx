


You said:
import { apiClientWithAuth } from "./apiClient";
import type { IPost, IComment, UploadPostDto } from "../common/types";
import { config } from "../config";
import { createFormData } from "../common/utils/createFormData";

class PostsService {
  private readonly endpoint;

  constructor() {
    this.endpoint = "/posts";
  }

  uploadPost(uploadDto: UploadPostDto) {
    // Each call returns its own AbortController so pages can cancel in-flight
    // requests (e.g. when unmounting or switching filters) without affecting
    // other consumers.
    const controller = new AbortController();

    const request = apiClientWithAuth.post(
      this.endpoint,
      createFormData(uploadDto),
      {
        signal: controller.signal,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return { request, cancel: () => controller.abort() };
  }

  getPost(postId: string) {
    const controller = new AbortController();
    const request = apiClientWithAuth.get<IPost>(${this.endpoint}/${postId}, {
      signal: controller.signal,
    });

    return { request, cancel: () => controller.abort() };
  }

  getByCityAndType(
    selectedCity: string,
    selectedType: string,
    page: number = 1,
    pageSize: number = config.defaultPageSize
  ) {
    const controller = new AbortController();
    const city = selectedCity ? selectedCity : "all";
    const type = selectedType ? selectedType : "all";
    const request = apiClientWithAuth.get(
      ${this.endpoint}/search/cityAndType/?city=${city}&type=${type}&page=${page}&pageSize=${pageSize},
      {
        signal: controller.signal,
      }
    );

    return { request, cancel: () => controller.abort() };
  }

  addCommentToPost(
    addCommentDto: { body: string; date: Date },
    postId: string
  ) {
    const controller = new AbortController();
    const request = apiClientWithAuth.post<IComment>(
      ${this.endpoint}/${postId}/comment,
      addCommentDto,
      {
        signal: controller.signal,
      }
    );

    return { request, cancel: () => controller.abort() };
  }

  getByUser(page: number = 1, pageSize: number = config.defaultPageSize) {
    const controller = new AbortController();
    const request = apiClientWithAuth.get(
      ${this.endpoint}/user/me?page=${page}&pageSize=${pageSize},
      {
        signal: controller.signal,
      }
    );
    return { request, cancel: () => controller.abort() };
  }

  editPost(postId: string, editDto: UploadPostDto) {
    const controller = new AbortController();

    const request = apiClientWithAuth.put(
      ${this.endpoint}/${postId},
      createFormData(editDto),
      {
        signal: controller.signal,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return { request, cancel: () => controller.abort() };
  }

  deletePost(postId: string) {
    const controller = new AbortController();
    const request = apiClientWithAuth.delete(${this.endpoint}/${postId}, {
      signal: controller.signal,
    });

    return { request, cancel: () => controller.abort() };
  }

  getTrainingTypes() {
    const controller = new AbortController();
    const request = apiClientWithAuth.get(${this.endpoint}/training/types, {
      signal: controller.signal,
    });
    return { request, cancel: () => controller.abort() };
  }

  addLike(postId: string, userId: string) {
    const controller = new AbortController();
    const request = apiClientWithAuth.put(${this.endpoint}/addLike/${postId}?userId=${userId}, {
      signal: controller.signal,
    });

    return { request, cancel: () => controller.abort() };
  }

  removeLike(postId: string, userId: string) {
    const controller = new AbortController();
    const request = apiClientWithAuth.put(${this.endpoint}/removeLike/${postId}?userId=${userId}, {
      signal: controller.signal,
    });

    return { request, cancel: () => controller.abort() };
  }

  getLikedPostsByUser(userId: string) {
    const controller = new AbortController();
    const request = apiClientWithAuth.get(${this.endpoint}/likedPosts/${userId}, {
      signal: controller.signal,
    });

    return { request, cancel: () => controller.abort() };
  }
}

const postsService = new PostsService();

export default postsService;




make slight change to make the comments better, keep them informative and simple and simplistic

ChatGPT said:
Here are slightly cleaner, more informative, simple comments—no logic changes:

  uploadPost(uploadDto: UploadPostDto) {
    // Create a per-call AbortController so each request can be cancelled independently
    // (e.g., on unmount, route change, or filter switch) without cancelling others.
    const controller = new AbortController();

    const request = apiClientWithAuth.post(
      this.endpoint,
      createFormData(uploadDto),
      {
        signal: controller.signal,
        headers: {
          // Sending files + fields (multipart form data)
          "Content-Type": "multipart/form-data",
        },
      }
    );

    // Return both the request promise and a cancel function for the caller.
    return { request, cancel: () => controller.abort() };
  }

  getPost(postId: string) {
    // Fetch a single post by id (cancellable).
    const controller = new AbortController();
    const request = apiClientWithAuth.get<IPost>(`${this.endpoint}/${postId}`, {
      signal: controller.signal,
    });

    return { request, cancel: () => controller.abort() };
  }

  getByCityAndType(
    selectedCity: string,
    selectedType: string,
    page: number = 1,
    pageSize: number = config.defaultPageSize
  ) {
    // Search posts by city/type with pagination. Empty values default to "all".
    const controller = new AbortController();
    const city = selectedCity ? selectedCity : "all";
    const type = selectedType ? selectedType : "all";

    const request = apiClientWithAuth.get(
      `${this.endpoint}/search/cityAndType/?city=${city}&type=${type}&page=${page}&pageSize=${pageSize}`,
      { signal: controller.signal }
    );

    return { request, cancel: () => controller.abort() };
  }
If you want, I can update the rest of the file’s comments in the same style (short + specific,


You said:
give full code file in response

ChatGPT said:
import { apiClientWithAuth } from "./apiClient";
import type { IPost, IComment, UploadPostDto } from "../common/types";
import { config } from "../config";
import { createFormData } from "../common/utils/createFormData";

class PostsService {
  private readonly endpoint;

  constructor() {
    this.endpoint = "/posts";
  }

  uploadPost(uploadDto: UploadPostDto) {
    // Create a per-call AbortController so each request can be cancelled independently
    // (e.g., on unmount, route change, or filter switch) without cancelling others.
    const controller = new AbortController();

    const request = apiClientWithAuth.post(
      this.endpoint,
      createFormData(uploadDto),
      {
        signal: controller.signal,
        headers: {
          // Sending files + fields (multipart form data)
          "Content-Type": "multipart/form-data",
        },
      }
    );

    // Return both the request promise and a cancel function for the caller.
    return { request, cancel: () => controller.abort() };
  }

  getPost(postId: string) {
    // Fetch a single post by id (cancellable).
    const controller = new AbortController();
    const request = apiClientWithAuth.get<IPost>(`${this.endpoint}/${postId}`, {
      signal: controller.signal,
    });

    return { request, cancel: () => controller.abort() };
  }

  getByCityAndType(
    selectedCity: string,
    selectedType: string,
    page: number = 1,
    pageSize: number = config.defaultPageSize
  ) {
    // Search posts by city/type with pagination. Empty values default to "all".
    const controller = new AbortController();
    const city = selectedCity ? selectedCity : "all";
    const type = selectedType ? selectedType : "all";

    const request = apiClientWithAuth.get(
      `${this.endpoint}/search/cityAndType/?city=${city}&type=${type}&page=${page}&pageSize=${pageSize}`,
      {
        signal: controller.signal,
      }
    );

    return { request, cancel: () => controller.abort() };
  }

  addCommentToPost(
    addCommentDto: { body: string; date: Date },
    postId: string
  ) {
    // Add a comment to a post (cancellable).
    const controller = new AbortController();
    const request = apiClientWithAuth.post<IComment>(
      `${this.endpoint}/${postId}/comment`,
      addCommentDto,
      {
        signal: controller.signal,
      }
    );

    return { request, cancel: () => controller.abort() };
  }

  getByUser(page: number = 1, pageSize: number = config.defaultPageSize) {
    // Get the current user's posts with pagination (cancellable).
    const controller = new AbortController();
    const request = apiClientWithAuth.get(
      `${this.endpoint}/user/me?page=${page}&pageSize=${pageSize}`,
      {
        signal: controller.signal,
      }
    );

    return { request, cancel: () => controller.abort() };
  }

  editPost(postId: string, editDto: UploadPostDto) {
    // Update a post by id. Uses multipart form data to support file changes (cancellable).
    const controller = new AbortController();

    const request = apiClientWithAuth.put(
      `${this.endpoint}/${postId}`,
      createFormData(editDto),
      {
        signal: controller.signal,
        headers: {
          // Sending files + fields (multipart form data)
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return { request, cancel: () => controller.abort() };
  }

  deletePost(postId: string) {
    // Delete a post by id (cancellable).
    const controller = new AbortController();
    const request = apiClientWithAuth.delete(`${this.endpoint}/${postId}`, {
      signal: controller.signal,
    });

    return { request, cancel: () => controller.abort() };
  }

  getTrainingTypes() {
    // Fetch available training types (cancellable).
    const controller = new AbortController();
    const request = apiClientWithAuth.get(`${this.endpoint}/training/types`, {
      signal: controller.signal,
    });

    return { request, cancel: () => controller.abort() };
  }

  addLike(postId: string, userId: string) {
    // Like a post as a specific user (cancellable).
    const controller = new AbortController();
    const request = apiClientWithAuth.put(
      `${this.endpoint}/addLike/${postId}?userId=${userId}`,
      {
        signal: controller.signal,
      }
    );

    return { request, cancel: () => controller.abort() };
  }

  removeLike(postId: string, userId: string) {
    // Remove a like from a post as a specific user (cancellable).
    const controller = new AbortController();
    const request = apiClientWithAuth.put(
      `${this.endpoint}/removeLike/${postId}?userId=${userId}`,
      {
        signal: controller.signal,
      }
    );

    return { request, cancel: () => controller.abort() };
  }

  getLikedPostsByUser(userId: string) {
    // Get all posts liked by a given user (cancellable).
    const controller = new AbortController();
    const request = apiClientWithAuth.get(
      `${this.endpoint}/likedPosts/${userId}`,
      {
        signal: controller.signal,
      }
    );

    return { request, cancel: () => controller.abort() };
  }
}

const postsService = new PostsService();

export default postsService;

You said:
import { GoogleGenAI } from "@google/genai";
import { config } from "../config";

const ai = new GoogleGenAI({
  apiKey: config.geminiApiKey,
});

export async function calculateCaloriesBurn(
  trainingType: string,
  trainingLength: number,
  height: number,
  weight: number,
  age: number
) {
  // Keep the prompt terse and deterministic so the UI can display just the
  // numeric calorie range without additional parsing.
  const contents = User Profile: ${height}cm, ${weight}kg, ${age} years old. 
    Activity: ${trainingType} for ${trainingLength} minutes. 
    Task: Provide ONLY the estimated calorie burn range (e.g. 300-400). No prose.;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents,
  });

  return You burn: ${response.text} in this training;
}




the same thing

ChatGPT said:
import { GoogleGenAI } from "@google/genai";
import { config } from "../config";

const ai = new GoogleGenAI({
  apiKey: config.geminiApiKey,
});

export async function calculateCaloriesBurn(
  trainingType: string,
  trainingLength: number,
  height: number,
  weight: number,
  age: number
) {
  // Keep the prompt short and consistent so the response is easy to display:
  // a simple calorie range only (no extra text to parse).
  const contents = `User Profile: ${height}cm, ${weight}kg, ${age} years old.
Activity: ${trainingType} for ${trainingLength} minutes.
Task: Return ONLY the estimated calorie burn range (example: 300-400). No extra words.`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents,
  });

  return `You burn: ${response.text} in this training`;
}

You said:
import { gatherCookie } from "../common/utils/token";
import axios from "axios";
import { config } from "../config";

const apiClient = axios.create({
  baseURL: config.backendUrl,
});

const apiClientWithAuth = axios.create({
  baseURL: config.backendUrl,
});

// Attach the latest JWT to every authenticated request so components can call
// services without juggling headers manually.
apiClientWithAuth.interceptors.request.use((config) => {
  config.headers["Authorization"] = Bearer ${gatherCookie("access_token")};
  return config;
});

// Centralized refresh-token flow: automatically retry once when we detect the
// access token expired, minting a fresh pair of tokens before replaying.
apiClientWithAuth.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (axios.isCancel(error)) {
      return Promise.reject(error);
    }

    const originalRequest = error.config;
    if (
      error.response.status === 401 &&
      originalRequest.url === "/auth/refresh"
    ) {
      return Promise.reject(error);
    }

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const response = await apiClient.get("/auth/refresh", {
          headers: {
            Authorization: Bearer ${gatherCookie("refresh_token")},
          },
        });
        document.cookie = access_token=${response.data.accessToken}; path=/;
        document.cookie = refresh_token=${response.data.refreshToken}; path=/;
        apiClient.defaults.headers.common[
          "Authorization"
        ] = Bearer ${response.data.accessToken};
        return apiClientWithAuth(originalRequest);
      } catch (error) {
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);

export { apiClient, apiClientWithAuth };

ChatGPT said:
import { gatherCookie } from "../common/utils/token";
import axios from "axios";
import { config } from "../config";

const apiClient = axios.create({
  baseURL: config.backendUrl,
});

const apiClientWithAuth = axios.create({
  baseURL: config.backendUrl,
});

// Attach the current access token to each request automatically,
// so callers don't need to pass Authorization headers manually.
apiClientWithAuth.interceptors.request.use((config) => {
  config.headers["Authorization"] = `Bearer ${gatherCookie("access_token")}`;
  return config;
});

// Refresh flow: if a request fails with 401, try to refresh the access token once
// using the refresh token, then retry the original request.
apiClientWithAuth.interceptors.response.use(
  (response) => response,
  async (error) => {
    // If the request was cancelled, just bubble it up.
    if (axios.isCancel(error)) {
      return Promise.reject(error);
    }

    const originalRequest = error.config;

    // If refresh itself is unauthorized, don't loop.
    if (
      error.response.status === 401 &&
      originalRequest.url === "/auth/refresh"
    ) {
      return Promise.reject(error);
    }

    // On first 401, attempt token refresh and retry the original request.
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const response = await apiClient.get("/auth/refresh", {
          headers: {
            Authorization: `Bearer ${gatherCookie("refresh_token")}`,
          },
        });

        // Persist new tokens for future requests.
        document.cookie = `access_token=${response.data.accessToken}; path=/`;
        document.cookie = `refresh_token=${response.data.refreshToken}; path=/`;

        // Update default header for non-auth client (optional convenience).
        apiClient.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${response.data.accessToken}`;

        return apiClientWithAuth(originalRequest);
      } catch (error) {
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export { apiClient, apiClientWithAuth };

You said:
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
    // The schema depends on server-provided training types, so ensure the list
    // is populated before users interact with the form.
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
    // Reset both the react-hook-form state and the derived Gemini response so
    // the UI returns to its initial blank slate.
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
                  error={!!errors.age}
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
                  error={!!errors.age}
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

ChatGPT said:
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
