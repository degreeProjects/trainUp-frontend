import { useEffect, useRef, useState } from "react";
import { Box, Typography, Stack, Grid } from "@mui/material";
import AntSwitch from "../../components/AntSwitch";
import EditPostDialog from "../EditPost";
import Post from "./Post";
import postsService from "../../services/postService";
import type { IPost, PostToEdit } from "../../common/types";
import userStore from "../../common/store/user.store";
import SelectCity from "../../components/SelectCity";
import { observer } from "mobx-react-lite";
import { fetchImageAndConvertToFile } from "../../common/utils/fetch-image";

const Explore = observer(() => {
  const { user } = userStore;
  const [isShowOnlyMyPosts, setIsShowOnlyMyPosts] = useState(false);
  const [posts, setPosts] = useState<IPost[]>([]);
  const [page, setPage] = useState(1);
  const [selectedCity, setSelectedCity] = useState("");
  const scrolledElementRef = useRef<HTMLDivElement | null>(null);
  const [openEditPostDialog, setOpenEditPostDialog] = useState(false);
  const [postToEdit, setPostToEdit] = useState<PostToEdit>();

  useEffect(() => {
    setSelectedCity(user?.homeCity ?? "");
  }, [user]);

  useEffect(() => {
    setPosts([]);
    setPage(1);
    scrolledElementRef.current!.scrollTop = 0;
  }, [selectedCity, isShowOnlyMyPosts]);

  useEffect(() => {
    console.log(posts);
    const postsRequest = determinePostsRequest();
    const { request, cancel } = postsRequest();
    request
      .then((res: any) => {
        if (page === 1) {
          setPosts(res.data);
        } else {
          setPosts((prevPosts) => [...prevPosts, ...res.data]);
        }
      })
      .catch((err: any) => {
        console.log(err);
      });

    return () => {
      cancel();
    };
  }, [page, selectedCity, isShowOnlyMyPosts]);

  useEffect(() => {
    const handleScroll = () => {
      const gridElement = scrolledElementRef.current as HTMLDivElement;
      if (gridElement) {
        const { scrollTop, scrollHeight, clientHeight } = gridElement;
        const heightRemainToScroll = scrollHeight - scrollTop - clientHeight;
        const treshold = (scrollHeight - scrollTop) * 0.1;

        if (heightRemainToScroll <= treshold) {
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

  const determinePostsRequest = () => {
    if (isShowOnlyMyPosts) {
      return () => {
        return postsService.getByUser(page);
      };
    } else {
      return () => {
        return postsService.getByCity(selectedCity, page);
      };
    }
  };

  const handleCloseEditDialog = (isEdited = false) => {
    setOpenEditPostDialog(false);
    if (isEdited) {
      setPage(1);
      scrolledElementRef.current!.scrollTop = 0;
      const postsRequest = determinePostsRequest();
      const { request } = postsRequest();
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
    const picture = await fetchImageAndConvertToFile(post.image);

    setPostToEdit({
      picture,
      city: post.city,
      type: post.type,
      description: post.description,
      postId: post._id,
    });

    setOpenEditPostDialog(true);
  };

  return (
    <>
      <Stack sx={{ p: 4, gap: 2 }}>
        <Stack spacing={2} sx={{ height: "10vh" }}>
          <Box sx={{ display: "flex", flexDirection: "row", gap: 1 }}>
            <Typography
              variant="h6"
              sx={{ color: "secondary.main", fontWeight: "bold" }}
            >
              Only My Posts
            </Typography>
            <AntSwitch
              checked={isShowOnlyMyPosts}
              onChange={(event) => setIsShowOnlyMyPosts(event.target.checked)}
              inputProps={{ "aria-label": "ant design" }}
              sx={{ my: "auto" }}
            />
          </Box>
          {!isShowOnlyMyPosts && (
            <SelectCity
              city={selectedCity}
              setCity={setSelectedCity}
              sx={{ width: "20vw", height: "5vh" }}
            />
          )}
        </Stack>
        <Grid
          container
          spacing={3}
          sx={{ maxHeight: "75vh", overflowY: "auto", mt: 1, pr: 2 }}
          ref={scrolledElementRef}
        >
          {posts.map((post, index) => (
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

export default Explore;
