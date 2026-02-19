import { Autocomplete, InputAdornment, TextField } from "@mui/material";
import { useEffect } from "react";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import { observer } from "mobx-react-lite";
import trainingTypesStore from "../common/store/trainingTypes.store";

interface Props {
  type: string;
  setType: (type: string) => void;
  sx?: any;
}

const SelectTrainingType = observer(({ type, setType, sx }: Props) => {
  const { types, fetchTrainingTypes } = trainingTypesStore;

  useEffect(() => {
    fetchTrainingTypes();
  }, []);

  return (
    <Autocomplete
      value={type}
      onChange={(_event, value: string | null) => setType(value ?? "")}
      options={[...types, ""]}
      renderInput={(params) => (
        <TextField
          {...params}
          label="type"
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
    />
  );
});

export default SelectTrainingType;
