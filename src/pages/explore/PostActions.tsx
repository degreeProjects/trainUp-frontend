import { Box, IconButton } from "@mui/material";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import MapsUgcOutlinedIcon from "@mui/icons-material/MapsUgcOutlined";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import { observer } from "mobx-react-lite";
import userStore from "../../common/store/user.store";
import type { IPost } from "../../common/types";

interface Props {
  post: IPost;
  onExpandClick: () => void;
  onDeleteClick: () => void;
  onEditClick: () => void;
  onLikeClick: () => void;
  onRemoveLikeClick: () => void;
}

const PostActions = observer(
  ({ post, onExpandClick, onDeleteClick, onEditClick, onLikeClick, onRemoveLikeClick }: Props) => {
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
        {user?._id === post?.user?._id && (
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
        <Box sx={{ ml: "auto" }}>
          {post?.likes.includes(user?._id || "") ? (
            <IconButton
              onClick={onRemoveLikeClick}
              sx={{
                ml: "auto",
                color: "primary.main",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.75)",
                },
              }}
            >
              <FavoriteRoundedIcon />
            </IconButton>
          ) : (
            <IconButton
              onClick={onLikeClick}
              sx={{
                ml: "auto",
                color: "primary.main",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.75)",
                },
              }}
            >
              <FavoriteBorderOutlinedIcon />
            </IconButton>
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
      </Box>
    );
  }
);

export default PostActions;
