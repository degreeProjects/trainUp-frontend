import { Box, Typography, Divider } from "@mui/material";

interface Props {
  text: string;
}

function HorizontalLineWithText({ text }: Props) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "25vw",
        my: 1,
        mx: "auto",
      }}
    >
      <Divider sx={{ width: "11vw", backgroundColor: "black" }} />
      <Typography
        variant="body2"
        sx={{
          mx: 2,
          color: "black",
        }}
      >
        {text}
      </Typography>
      <Divider sx={{ width: "11vw", backgroundColor: "black" }} />
    </Box>
  );
}

export default HorizontalLineWithText;
