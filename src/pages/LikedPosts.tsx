import { useEffect, useRef, useState } from "react";
import userStore from "../common/store/user.store";
import { Stack, Grid } from "@mui/material";
import EditPostDialog from "./EditPost";
import Post from "./explore/Post";
import postsService from "../services/postService";
import type { IPost, PostToEdit } from "../common/types";
import { observer } from "mobx-react-lite";
import { fetchImageAndConvertToFile } from "../common/utils/fetch-image";

const LikedPosts = observer(() => {
  const { user } = userStore;
  const [posts, setPosts] = useState<IPost[]>([]);
  const [page, setPage] = useState(1);
  const scrolledElementRef = useRef<HTMLDivElement | null>(null);
  const [openEditPostDialog, setOpenEditPostDialog] = useState(false);
  const [postToEdit, setPostToEdit] = useState<PostToEdit>();

  useEffect(() => {
    const postsRequest = postsService.getLikedPostsByUser(user?._id || "");
    const { request, cancel } = postsRequest;
    request
      .then((res: any) => {
        if (page === 1) {
          setPosts(res.data);
        } else {
          // Append to the existing array to simulate infinite scroll within the
          // liked-posts subset.
          setPosts((prevPosts) => [...prevPosts, ...res.data]);
        }
      })
      .catch((err: any) => {
        console.log(err);
      });

    return () => {
      cancel();
    };
  }, [page]);

  useEffect(() => {
    const handleScroll = () => {
      const gridElement = scrolledElementRef.current as HTMLDivElement;
      if (gridElement) {
        const { scrollTop, scrollHeight, clientHeight } = gridElement;
        const heightRemainToScroll = scrollHeight - scrollTop - clientHeight;
        const treshold = (scrollHeight - scrollTop) * 0.1;

        if (heightRemainToScroll <= treshold) {
          // Remove the listener until the next render so we don't overshoot the
          // page counter when users fling-scroll.
          gridElement.removeEventListener("scroll", handleScroll);
          setPage((prevPage) => prevPage + 1);
        }
      }
    };

    const gridElement = scrolledElementRef.current as HTMLDivElement;
    if (gridElement) {
      gridElement.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (gridElement) {
        gridElement.removeEventListener("scroll", handleScroll);
      }
    };
  }, [posts]);

  const handleCloseEditDialog = (isEdited = false) => {
    setOpenEditPostDialog(false);
    if (isEdited) {
      setPage(1);
      scrolledElementRef.current!.scrollTop = 0;
      const postsRequest = postsService.getLikedPostsByUser(user?._id || "");
      const { request } = postsRequest;
      request
        .then((res: any) => {
          if (res.data.length) setPosts(res.data);
        })
        .catch((err: any) => {
          console.log(err);
        });
    }
  };

  const onOpenEditPostDialog = async (post: IPost) => {
    const picture = post.image
      ? await fetchImageAndConvertToFile(post.image)
      : undefined;

    setPostToEdit({
      picture,
      city: post.city,
      type: post.type,
      notes: post.notes ?? post.description ?? "",
      trainingLength: post.trainingLength,
      postId: post._id,
    });

    setOpenEditPostDialog(true);
  };

  const getFilteredPosts = () => {
    // In case another device unliked a post, double-check membership client
    // side so we don't render cards the server no longer considers \"liked\".
    return posts.filter((post) => post.likes.includes(user?._id || ""));
  };

  return (
    <>
      <Stack sx={{ p: 4, gap: 2 }}>
        <Grid
          container
          spacing={3}
          sx={{
            height: "70vh",
            overflowY: "auto",
            pr: 2,
          }}
          ref={scrolledElementRef}
        >
          {getFilteredPosts().map((post, index) => (
            <Post
              post={post}
              setPosts={setPosts}
              key={index}
              openEditPostDialog={onOpenEditPostDialog}
            />
          ))}
        </Grid>
      </Stack>

      {postToEdit && (
        <EditPostDialog
          open={openEditPostDialog}
          postToEdit={postToEdit}
          onClose={handleCloseEditDialog}
        />
      )}
    </>
  );
});

export default LikedPosts;
