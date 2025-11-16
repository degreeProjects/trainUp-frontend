import { useForm, Controller, type SubmitHandler } from "react-hook-form";
import {
  InputAdornment,
  TextField,
  Button,
  IconButton,
  Box,
  Stack,
  Typography,
} from "@mui/material";
import RestaurantMenuOutlinedIcon from "@mui/icons-material/RestaurantMenuOutlined";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { type ChangeEvent, useState, useRef } from "react";
import CancelIcon from "@mui/icons-material/Cancel";
import { config } from "../config";
import type { PostFormInput, UploadPostDto } from "../common/types";

const schema = yup.object({
  restaurant: yup.string().required("restaurant is required"),
  description: yup.string().required("description is required"),
});

interface Props {
  sx?: any;
  uploadPostDto: UploadPostDto;
  submitText: string;
  onSubmitFunc: (uploadDto: UploadPostDto) => void;
}

function PostForm({ sx, uploadPostDto, submitText, onSubmitFunc }: Props) {
  const [postImage, setPostImage] = useState<File | undefined>(
    uploadPostDto.picture
  );
  const [postImageError, setPostImageError] = useState("");
  const hiddenFileInput = useRef<HTMLInputElement>(null);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitted },
  } = useForm<PostFormInput>({
    values: {
      restaurant: uploadPostDto.restaurant,
      description: uploadPostDto.description,
    },
    resolver: yupResolver(schema),
  });

  const changeProfileImage = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setPostImage(e.target?.files[0]);
      setPostImageError("");
    }
  };

  const openFileInput = () => {
    hiddenFileInput?.current?.click();
  };

  const resetPostImage = () => {
    setPostImage(undefined);
    if (isSubmitted) {
      setPostImageError("post image is required");
    }
  };

  const setPostImageErrorOnSubmit = () => {
    if (!postImage) {
      setPostImageError("post image is required");
    }
  };

  const onSuccessSubmit: SubmitHandler<PostFormInput> = async (data) => {
    setPostImageErrorOnSubmit();
    if (postImage) {
      onSubmitFunc({
        picture: postImage!,
        ...data,
      });
    }
  };

  const onErrorSubmit = () => {
    setPostImageErrorOnSubmit();
  };

  return (
    <form style={sx} onSubmit={handleSubmit(onSuccessSubmit, onErrorSubmit)}>
      <Stack spacing={3} alignItems="center">
        <input
          type="file"
          ref={hiddenFileInput}
          onChange={changeProfileImage}
          style={{ display: "none" }}
        />
        <Stack spacing={1}>
          {postImage ? (
            <Box style={{ position: "relative" }}>
              <img
                src={URL.createObjectURL(postImage)}
                width={200}
                height={200}
                style={{ borderRadius: "2rem" }}
                alt="Preview"
              />
              <IconButton
                sx={{ position: "absolute", color: "primary.main" }}
                onClick={resetPostImage}
                size="large"
              >
                <CancelIcon />
              </IconButton>
            </Box>
          ) : (
            <Box
              sx={{
                backgroundColor: "white",
                borderRadius: "2rem",
                border: "black dashed 2px",
                px: 2,
              }}
              onClick={openFileInput}
            >
              <img
                width={200}
                height={200}
                src={config.publicFolderUrl + "add-photo.png"}
                alt="Preview"
              />
            </Box>
          )}
          {postImageError && (
            <Typography
              variant="caption"
              sx={{
                fontWeight: "bold",
                mb: 5,
                color: "error.main",
              }}
            >
              {postImageError}
            </Typography>
          )}
        </Stack>
        <Controller
          name="restaurant"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              error={!!errors.restaurant}
              fullWidth
              label="restaurant"
              placeholder="restaurant Name"
              helperText={errors.restaurant?.message}
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <RestaurantMenuOutlinedIcon />
                  </InputAdornment>
                ),
              }}
            />
          )}
        />
        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              error={!!errors.description}
              multiline
              fullWidth
              placeholder="Enter description here... "
              helperText={errors.description?.message}
              rows={6}
              sx={{
                borderRadius: 7,
                "& .MuiOutlinedInput-root": {
                  borderRadius: 7,
                  backgroundColor: "background.paper",
                },
              }}
              inputProps={{ sx: { color: "#53606D" } }}
            />
          )}
        />
        <Button
          variant="contained"
          type="submit"
          endIcon={<CloudUploadIcon />}
          sx={{
            color: "white",
            backgroundColor: "primary.main",
            ":hover": { backgroundColor: "primary.main" },
            width: "50%",
            mx: "auto",
            height: "6vh",
            mt: 2,
          }}
        >
          {submitText}
        </Button>
      </Stack>
    </form>
  );
}

export default PostForm;
