import { Box, IconButton } from "@mui/material";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import MapsUgcOutlinedIcon from "@mui/icons-material/MapsUgcOutlined";
import { observer } from "mobx-react-lite";
import userStore from "../../common/store/user.store";

interface Props {
  userId: string;
  onExpandClick: () => void;
  onDeleteClick: () => void;
  onEditClick: () => void;
}

const PostActions = observer(
  ({ userId, onExpandClick, onDeleteClick, onEditClick }: Props) => {
    const { user } = userStore;

    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          position: "absolute",
          width: "100%",
          zIndex: 1,
          pt: 1,
        }}
      >
        {user?._id === userId && (
          <Box sx={{ mr: "auto" }}>
            <IconButton
              onClick={onDeleteClick}
              sx={{
                color: "primary.main",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.75)",
                },
              }}
            >
              <DeleteOutlinedIcon />
            </IconButton>
            <IconButton
              onClick={onEditClick}
              sx={{
                color: "primary.main",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.75)",
                },
              }}
            >
              <EditOutlinedIcon />
            </IconButton>
          </Box>
        )}
        <IconButton
          onClick={onExpandClick}
          sx={{
            ml: "auto",
            color: "primary.main",
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.75)",
            },
          }}
        >
          <MapsUgcOutlinedIcon />
        </IconButton>
      </Box>
    );
  }
);

export default PostActions;
