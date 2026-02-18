import { type IComment } from "../../common/types";
import { Avatar, Box, Stack, Typography } from "@mui/material";
import { calculateTimeAgo } from "../../common/utils/calculateTimeAgo";
import { useEffect, useState } from "react";
import { config } from "../../config";

/**
 * Presentational component that renders a single comment.
 * Displays the commenter's avatar, full name, relative timestamp (e.g. "5 minutes ago"),
 * and the comment body. The relative time is calculated once on mount and whenever the comment changes.
 */
interface Props {
  comment: IComment;
}

function Comment({ comment }: Props) {
  const [timeAgo, setTimeAgo] = useState("");

  useEffect(() => {
    setTimeAgo(calculateTimeAgo(new Date(comment.date)));
  }, [comment]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        backgroundColor: "background.paper",
        borderRadius: 8,
        p: 2,
        gap: 4,
      }}
    >
      <Avatar
        src={
          comment.user.profileImage
            ? config.uploadFolderUrl + comment.user.profileImage
            : config.publicFolderUrl + "profile.png"
        }
        sx={{ width: 56, height: 56 }}
      ></Avatar>
      <Stack>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 3,
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            {comment.user.fullName}
          </Typography>
          <Typography variant="body2" color="secondary.100">
            {timeAgo}
          </Typography>
        </Box>
        <Typography variant="body1">{comment.body}</Typography>
      </Stack>
    </Box>
  );
}

export default Comment;
