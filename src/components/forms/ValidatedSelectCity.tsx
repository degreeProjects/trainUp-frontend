import { Autocomplete, InputAdornment, TextField } from "@mui/material";
import { useEffect } from "react";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import { observer } from "mobx-react-lite";
import citiesStore from "../../common/store/cities.store";
import { type Control, Controller } from "react-hook-form";
import type { PostFormInput } from "../../common/types";

interface Props {
  control: Control<PostFormInput>;
  sx?: any;
}

const ValidatedSelectCity = observer(({ control, sx }: Props) => {
  const { cities, fetchCities } = citiesStore;

  useEffect(() => {
    fetchCities();
  }, []);

  return (
    <Controller
      name="city"
      control={control}
      render={({ field, formState: { errors } }) => (
        <Autocomplete
          style={{ marginBottom: 10 }}
          {...field}
          options={[...cities, ""]}
          renderInput={(params) => (
            <TextField
              {...params}
              label="city"
              error={!!errors.city}
              helperText={errors.city?.message}
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

export default ValidatedSelectCity;
