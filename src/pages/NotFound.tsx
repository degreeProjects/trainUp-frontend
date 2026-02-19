import { Box, Typography } from "@mui/material";

function NotFound() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Typography variant="h2">
        404 The page you were looking for doesn't exist
      </Typography>
    </Box>
  );
}

export default NotFound;
