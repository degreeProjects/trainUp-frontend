import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import type { LinkItem as Props } from "../common/types";

function NavButton({ path, title }: Props) {
  return (
    <Link to={path} style={{ marginLeft: "32px" }}>
      <Button sx={{ color: "white", paddingBottom: "0" }}>
        <Typography variant="subtitle1">{title}</Typography>
      </Button>
    </Link>
  );
}

export default NavButton;
