import { useForm, Controller, type SubmitHandler } from "react-hook-form";
import {
  TextField,
  Button,
  IconButton,
  Box,
  Stack,
  Typography,
  Backdrop,
  CircularProgress,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import AccessAlarmOutlinedIcon from "@mui/icons-material/AccessAlarmOutlined";
import { InputAdornment } from "@mui/material";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { type ChangeEvent, useState, useRef } from "react";
import CancelIcon from "@mui/icons-material/Cancel";
import { config } from "../../config";
import type { PostFormInput, UploadPostDto } from "../../common/types";
import ValidatedSelectCity from "./ValidatedSelectCity";
import SelectTrainingType from "./SelectTrainingType";

const schema = yup
  .object({
    notes: yup
      .string()
      .max(600, "notes must be under 600 characters")
      .optional()
      .default(""),
    city: yup.string().required("city is required"),
    type: yup.string().required("training type is required"),
    trainingLength: yup
      .number()
      .required("training length is required")
      .min(1, "training length must be at least 1"),
  })
  .required();

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
    formState: { errors, isSubmitted, isSubmitting },
  } = useForm<PostFormInput>({
    values: {
      notes: uploadPostDto.notes ?? "",
      city: uploadPostDto.city,
      type: uploadPostDto.type,
      trainingLength: uploadPostDto.trainingLength,
    },
    resolver: yupResolver<PostFormInput>(schema),
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
    // react-hook-form handles text fields, but the image input is unmanaged, so
    // enforce the \"required\" constraint manually once the user tries to submit.
    if (!postImage) {
      setPostImageError("post image is required");
    }
  };

  const onSuccessSubmit: SubmitHandler<PostFormInput> = async (data) => {
    setPostImageErrorOnSubmit();
    if (postImage) {
      // Merge the validated fields with the File before handing control to the
      // parent so upload/edit flows can reuse the same form component.
      onSubmitFunc({
        picture: postImage!,
        ...data,
        notes: data.notes ?? "",
      });
    }
  };

  const onErrorSubmit = () => {
    setPostImageErrorOnSubmit();
  };

  return (
    <>
      <Backdrop
        open={isSubmitting}
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.modal + 1 }}
      >
        <Stack spacing={2} alignItems="center">
          <CircularProgress color="inherit" />
          <Typography variant="h6">Asking your AI coach...</Typography>
        </Stack>
      </Backdrop>
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
        <ValidatedSelectCity
          control={control}
          sx={{ height: "5vh", width: "30vw" }}
        />
        <SelectTrainingType
          control={control}
          sx={{ height: "5vh", width: "30vw" }}
        />
        <Controller
          name="trainingLength"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              type="number"
              error={!!errors.trainingLength}
              disabled={isSubmitting}
              fullWidth
              label="training length (minutes)"
              placeholder="training length"
              helperText={errors.trainingLength?.message}
              variant="outlined"
              sx={{ width: "30vw" }}
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
          name="notes"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              error={!!errors.notes}
              multiline
              fullWidth
              label="Notes - For AI Personal Trainer"
              placeholder="How did the workout feel? Anything the AI coach should know?"
              helperText={errors.notes?.message}
              rows={6}
              sx={{
                borderRadius: 7,
                "& .MuiOutlinedInput-root": {
                  borderRadius: 7,
                  backgroundColor: "background.paper",
                },
              }}
              inputProps={{ sx: { color: "#53606D" }, maxLength: 600 }}
              disabled={isSubmitting}
            />
          )}
        />
        <Button
          variant="contained"
          type="submit"
          endIcon={<CloudUploadIcon />}
          disabled={isSubmitting}
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
          {isSubmitting ? "Working with AI..." : submitText}
        </Button>
      </Stack>
      </form>
    </>
  );
}

export default PostForm;
