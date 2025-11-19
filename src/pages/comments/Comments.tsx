import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Stack, TextField, Typography } from "@mui/material";
import ControlPointOutlinedIcon from "@mui/icons-material/ControlPointOutlined";
import { type IComment } from "../../common/types";
import Comment from "./Comment";
import postsService from "../../services/postService";

function Comments() {
  const navigate = useNavigate();
  const { postId } = useParams();
  const [comments, setComments] = useState<IComment[]>([]);
  const [commentText, setCommentText] = useState("");

  useEffect(() => {
    if (!postId) {
      navigate("/");
    }

    const { request } = postsService.getPost(postId!);

    request
      .then((res) => {
        if (!res.data) navigate("/");
        setComments(res.data.comments);
      })
      .catch((err) => {
        console.log(err);
        navigate("/");
      });
  }, []);

  const postComment = () => {
    const { request } = postsService.addCommentToPost(
      {
        body: commentText,
        date: new Date(),
      },
      postId!
    );

    request
      .then((res) => {
        setComments(res.data as unknown as IComment[]);
        setCommentText("");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <Stack sx={{ p: 4, width: "60%", mx: "auto" }}>
      <Typography
        variant="h4"
        color="secondary.main"
        sx={{ fontWeight: "bold", textAlign: "center" }}
      >
        Post Comments
      </Typography>
      <Stack sx={{ height: "55vh", overflowY: "auto", pr: 1, gap: 3, mt: 4 }}>
        {comments.map((comment, index) => (
          <Comment comment={comment} key={index} />
        ))}
      </Stack>
      <TextField
        multiline
        placeholder="Enter your Comment here... "
        rows={4}
        value={commentText}
        onChange={(event) => setCommentText(event.target.value)}
        sx={{
          mt: 5,
          backgroundColor: "background.paper",
          borderRadius: 7,
          "& .MuiOutlinedInput-root": {
            borderRadius: 7,
          },
        }}
        inputProps={{ sx: { color: "#53606D" } }}
      ></TextField>
      <Button
        sx={{
          backgroundColor: "primary.main",
          color: "white",
          width: "15vw",
          height: "5vh",
          mt: 2,
          mx: "auto",
          gap: 1,
          ":hover": { backgroundColor: "primary.main" },
        }}
        variant="contained"
        onClick={postComment}
        disabled={!commentText}
      >
        <Typography>Add Your Own Comment</Typography>
        <ControlPointOutlinedIcon />
      </Button>
    </Stack>
  );
}

export default Comments;
