import { Autocomplete, InputAdornment, TextField } from "@mui/material";
import { useEffect } from "react";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import { observer } from "mobx-react-lite";
import trainingTypesStore from "../../common/store/trainingTypes.store";
import { type Control, Controller } from "react-hook-form";
import type { PostFormInput } from "../../common/types";

interface Props {
  control: Control<PostFormInput>;
  sx?: any;
}

const SelectTrainingType = observer(({ control, sx }: Props) => {
  const { types, fetchTrainingTypes } = trainingTypesStore;

  useEffect(() => {
    fetchTrainingTypes();
  }, []);

  return (
    <Controller
      name="type"
      control={control}
      render={({ field, formState: { errors } }) => (
        <Autocomplete
          style={{ marginBottom: 10 }}
          {...field}
          options={[...types, ""]}
          renderInput={(params) => (
            <TextField
              {...params}
              label="type"
              error={!!errors.city}
              helperText={errors.city?.message}
              placeholder="type"
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
            ...sx,
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
  );
});

export default SelectTrainingType;
