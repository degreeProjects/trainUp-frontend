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
  CircularProgress,
  Button,
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
  const [isRefreshingAi, setIsRefreshingAi] = useState(false);
  const notes = (post?.notes ?? post?.description ?? "").trim();
  const hasAiTips = !!post?.aiTips && post.aiTips.trim().length > 0;
  const caloriesSummary = post?.caloriesSummary?.trim();

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

  const refreshAiInsights = async () => {
    setIsRefreshingAi(true);
    const { request, cancel } = postsService.getPost(post._id);
    try {
      const response = await request;
      const refreshed = response.data;
      setPosts((prev) =>
        prev.map((p) => (p?._id === refreshed._id ? refreshed : p))
      );
    } catch (err) {
      console.error(err);
    } finally {
      cancel();
      setIsRefreshingAi(false);
    }
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
          </Box>

          {notes && (
            <Box
              sx={{
                mt: 1,
                p: 1.25,
                borderRadius: 2,
                backgroundColor: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.12)",
                maxHeight: 100,
                overflowY: "auto",
              }}
            >
              <Typography
                variant="caption"
                sx={{ color: "rgba(255,255,255,0.7)" }}
              >
                Notes - For AI Personal Trainer
              </Typography>
              <Typography variant="body2" color="white" sx={{ mt: 0.5 }}>
                {notes}
              </Typography>
            </Box>
          )}

          {(caloriesSummary || hasAiTips || !caloriesSummary) && (
            <Box
              sx={{
                mt: 1,
                p: 1.25,
                borderRadius: 2,
                background:
                  "linear-gradient(135deg, rgba(255,255,255,0.14), rgba(255,255,255,0.05))",
                border: "1px solid rgba(255,255,255,0.2)",
              }}
            >
              {!caloriesSummary && !hasAiTips ? (
                <Stack spacing={1.5} alignItems="center">
                  <CircularProgress size={20} sx={{ color: "white" }} />
                  <Typography variant="body2" color="white">
                    {isRefreshingAi
                      ? "Checking for new AI insights..."
                      : "AI coach is still generating insights..."}
                  </Typography>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={refreshAiInsights}
                    disabled={isRefreshingAi}
                    sx={{ borderColor: "white", color: "white" }}
                  >
                    {isRefreshingAi ? "Refreshing..." : "Refresh AI Insight"}
                  </Button>
                </Stack>
              ) : null}
              {caloriesSummary && (
                <Box>
                  <Typography
                    variant="caption"
                    sx={{ color: "rgba(255,255,255,0.7)" }}
                  >
                    AI Calories Estimate
                  </Typography>
                  <Typography variant="body2" color="white" sx={{ mt: 0.5 }}>
                    {caloriesSummary}
                  </Typography>
                </Box>
              )}
              {hasAiTips && (
                <Box sx={{ mt: caloriesSummary ? 1 : 0 }}>
                  <Typography
                    variant="caption"
                    sx={{ color: "rgba(255,255,255,0.7)" }}
                  >
                    AI Trainer Tips
                  </Typography>
                  <Typography variant="body2" color="white" sx={{ mt: 0.5 }}>
                    {post?.aiTips}
                  </Typography>
                </Box>
              )}
            </Box>
          )}

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
