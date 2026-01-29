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
} from "@mui/material";
import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";
import userStore from "../../common/store/user.store";
import { useNavigate } from "react-router-dom";
import type { IPost } from "../../common/types";
import PostActions from "./PostActions";
import { config } from "../../config";
import postsService from "../../services/postService";
import type { Dispatch, SetStateAction } from "react";

interface Props {
  post: IPost;
  setPosts: Dispatch<SetStateAction<IPost[]>>;
  openEditPostDialog: (post: IPost) => void;
}

function Post({ post, setPosts, openEditPostDialog }: Props) {
  const navigate = useNavigate();
  const { user } = userStore;

  const deletePost = async (postId: string) => {
    const { request: deletePost } = postsService.deletePost(postId);

    try {
      await deletePost;
      setPosts((prevPosts) => prevPosts.filter((post) => post?._id !== postId));
    } catch (err) {
      console.error(err);
    }
  };

  const addLike = async (postId: string) => {
    try {
      const newPost = (await (postsService.addLike(postId, user?._id!!)).request).data;
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
    <Grid item xs={12} sm={6} md={4}>
      <Card
        elevation={3}
        sx={{
          backgroundColor: "primary.main",
          position: "relative",
          borderRadius: 2,
          overflow: "hidden",
          height: "27vh",
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
          <CardMedia
            component="img"
            image={config.uploadFolderUrl + post?.image}
            alt="post image"
            sx={{
              width: "100%",
              height: 100,
              objectFit: "cover",
            }}
          />
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
    </Grid>
  );
}

export default Post;
