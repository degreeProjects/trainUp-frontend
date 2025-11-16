import {
  Avatar,
  Box,
  Card,
  CardContent,
  CardMedia,
  Stack,
  Tooltip,
  Typography,
  Grid,
} from "@mui/material";
import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";
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

  const deletePost = async (postId: string) => {
    const { request: deletePost } = postsService.deletePost(postId);

    try {
      await deletePost;
      setPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId));
    } catch (err) {
      console.error(err);
    }
  };

  const showPostComments = () => {
    navigate(`/comments/${post._id}`);
  };

  return (
    <Grid item md={3}>
      <Card
        elevation={0}
        sx={{ backgroundColor: "primary.main", position: "relative" }}
      >
        <PostActions
          userId={post.user._id}
          onDeleteClick={() => deletePost(post._id)}
          onExpandClick={showPostComments}
          onEditClick={() => openEditPostDialog(post)}
        />
        <CardMedia
          title={post.restaurant}
          sx={{
            height: "25vh",
            position: "relative",
          }}
        >
          <Box
            component="img"
            src={config.uploadFolderUrl + post.image}
            alt={post.restaurant}
            sx={{
              position: "absolute",
              width: "100%",
              height: "100%",
              filter: "blur(10px)",
              transform: "scale(1.1)",
              pointerEvents: "none",
            }}
          />
          <Box
            component="img"
            src={config.uploadFolderUrl + post.image}
            alt={post.restaurant}
            sx={{
              position: "relative",
              width: "100%",
              height: "100%",
              objectFit: "contain",
              pointerEvents: "none",
            }}
          />
        </CardMedia>
        <CardContent sx={{ mt: 2 }}>
          <Stack>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Box sx={{ display: "flex" }}>
                <Typography
                  variant="h6"
                  color="white"
                  sx={{
                    fontWeight: "bold",
                    display: "flex",
                    flexDirection: "row",
                    gap: 0.5,
                  }}
                >
                  {post.restaurant}
                </Typography>
                <Tooltip title={post.user.fullName} placement="top">
                  <Avatar
                    src={
                      post.user.profileImage
                        ? config.uploadFolderUrl + post.user.profileImage
                        : config.publicFolderUrl + "profile.png"
                    }
                    alt={post.user.fullName}
                    sx={{
                      width: "3vh",
                      height: "3vh",
                      borderRadius: "50%",
                      ml: 1,
                    }}
                  ></Avatar>
                </Tooltip>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Typography variant="subtitle1" color="white">
                  {post.comments.length}
                </Typography>
                <ChatOutlinedIcon
                  sx={{ color: "white", width: "20px", ml: 0.5 }}
                />
              </Box>
            </Box>
          </Stack>
          <Grid container>
            <Grid item md={10} height="10vh">
              <Typography
                variant="body1"
                color="white"
                sx={{
                  mt: 1,
                  maxHeight: "8vh",
                  overflowY: "auto",
                }}
              >
                {post.description}
              </Typography>
            </Grid>
            <Grid
              item
              md={2}
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "end",
              }}
            >
              <Typography variant="body2" color="white" sx={{ ml: 1 }}>
                {new Date(post.createdAt).toLocaleDateString("he-IL")}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Grid>
  );
}

export default Post;
