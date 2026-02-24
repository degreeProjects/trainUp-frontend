import {
  Avatar,
  Box,
  Card,
  CardContent,
  Stack,
  Tooltip,
  Typography,
  Grid,
  CardMedia,
  Dialog,
  DialogContent,
  IconButton,
} from "@mui/material";
import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";
import CloseIcon from "@mui/icons-material/Close";
import userStore from "../../common/store/user.store";
import { useNavigate } from "react-router-dom";
import type { IPost } from "../../common/types";
import PostActions from "./PostActions";
import { config } from "../../config";
import postsService from "../../services/postService";
import type { Dispatch, SetStateAction } from "react";
import { useState } from "react";

interface Props {
  post: IPost;
  setPosts: Dispatch<SetStateAction<IPost[]>>;
  openEditPostDialog: (post: IPost) => void;
}

function Post({ post, setPosts, openEditPostDialog }: Props) {
  const navigate = useNavigate();
  const { user } = userStore;
  const [imageDialogOpen, setImageDialogOpen] = useState(false);

  const handleImageClick = () => {
    setImageDialogOpen(true);
  };

  const handleCloseImageDialog = () => {
    setImageDialogOpen(false);
  };

  const deletePost = async (postId: string) => {
    const { request: deletePost } = postsService.deletePost(postId);

    try {
      await deletePost;
      // Trim the deleted card locally so the grid updates immediately without
      // refetching the whole page.
      setPosts((prevPosts) => prevPosts.filter((post) => post?._id !== postId));
    } catch (err) {
      console.error(err);
    }
  };

  const addLike = async (postId: string) => {
    try {
      const newPost = (await (postsService.addLike(postId, user?._id!!)).request).data;
      // Replace only the affected post to keep pagination state intact.
      setPosts((prev) =>
        prev.map((post) => (post?._id === newPost._id ? newPost : post))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const removeLike = async (postId: string) => {
    try {
      const newPost = (await (postsService.removeLike(postId, user?._id!!)).request).data;
      // Replace only the affected post to keep pagination state intact.
      setPosts((prev) =>
        prev.map((post) => (post?._id === newPost._id ? newPost : post))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const showPostComments = () => {
    navigate(`/comments/${post?._id}`);
  };

  return (
    <Grid item xs={12} sm={6} md={3}>
      <Card
        elevation={3}
        sx={{
          backgroundColor: "primary.main",
          position: "relative",
          borderRadius: 2,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <PostActions
          post={post}
          onDeleteClick={() => deletePost(post?._id)}
          onExpandClick={showPostComments}
          onEditClick={() => openEditPostDialog(post)}
          onLikeClick={() => addLike(post?._id)}
          onRemoveLikeClick={() => removeLike(post?._id)}
        />

        {post?.image && (
          <Box
            onClick={handleImageClick}
            sx={{
              width: "100%",
              aspectRatio: "5 / 3",
              position: "relative",
              cursor: "pointer",
              overflow: "hidden",
              transition: "opacity 0.2s",
              "&:hover": {
                opacity: 0.85,
              },
            }}
          >
            {/* Blurred background layer – fills empty space */}
            <Box
              component="img"
              src={config.uploadFolderUrl + post?.image}
              alt=""
              aria-hidden
              sx={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                filter: "blur(20px)",
                transform: "scale(1.1)",
              }}
            />

            {/* Sharp foreground image – fully visible */}
            <CardMedia
              component="img"
              image={config.uploadFolderUrl + post?.image}
              alt="post image"
              sx={{
                position: "relative",
                width: "100%",
                height: "100%",
                objectFit: "contain",
              }}
            />
          </Box>
        )}

        <CardContent sx={{ mt: 1, p: 1 }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Tooltip title={post?.user?.fullName ?? ""} placement="top">
              <Avatar
                src={
                  post?.user?.profileImage
                    ? config.uploadFolderUrl + post?.user.profileImage
                    : config.publicFolderUrl + "profile.png"
                }
                alt={post?.user?.fullName ?? ""}
                sx={{ width: 32, height: 32 }}
              />
            </Tooltip>

            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Typography variant="subtitle2" color="white" sx={{ mr: 0.5 }}>
                {post?.comments?.length}
              </Typography>
              <ChatOutlinedIcon sx={{ color: "white", fontSize: 18 }} />
            </Box>
          </Stack>

          <Box sx={{ mt: 0.5 }}>
            <Typography variant="body2" color="white">
              City: {post?.city}
            </Typography>
            <Typography variant="body2" color="white">
              Type: {post?.type}
            </Typography>
            <Typography variant="body2" color="white">
              Training Length: {post?.trainingLength} min
            </Typography>
            <Typography
              variant="body2"
              color="white"
              sx={{
                mt: 0.5,
                maxHeight: 60,
                overflowY: "auto",
              }}
            >
              Description: {post?.description}
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              mt: 0.5,
            }}
          >
            <Typography variant="caption" color="white">
              {new Date(post?.createdAt).toLocaleDateString("he-IL")}
            </Typography>
          </Box>
        </CardContent>
      </Card>

      <Dialog
        open={imageDialogOpen}
        onClose={handleCloseImageDialog}
        maxWidth={false}
        PaperProps={{
          sx: {
            width: "65vw",
            maxWidth: "65vw",
            maxHeight: "85vh",
            backgroundColor: "black",
            overflow: "hidden",
          },
        }}
      >
        <IconButton
          onClick={handleCloseImageDialog}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: "white",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            "&:hover": {
              backgroundColor: "rgba(0, 0, 0, 0.7)",
            },
            zIndex: 1,
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent
          sx={{
            p: 2,
            backgroundColor: "black",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
          }}
        >
          <img
            src={config.uploadFolderUrl + post?.image}
            alt="post image full size"
            style={{
              maxWidth: "100%",
              maxHeight: "80vh",
              width: "auto",
              height: "auto",
              objectFit: "contain",
              display: "block",
            }}
          />
        </DialogContent>
      </Dialog>
    </Grid>
  );
}

export default Post;
