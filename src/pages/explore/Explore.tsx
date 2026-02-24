import { useEffect, useRef, useState } from "react";
import { Box, Typography, Stack, Grid } from "@mui/material";
import AntSwitch from "../../components/AntSwitch";
import EditPostDialog from "../EditPost";
import Post from "./Post";
import postsService from "../../services/postService";
import type { IPost, PostToEdit } from "../../common/types";
import SelectCity from "../../components/SelectCity";
import SelectTrainingType from "../../components/SelectTrainingType";
import { observer } from "mobx-react-lite";
import { fetchImageAndConvertToFile } from "../../common/utils/fetch-image";

const Explore = observer(() => {
  const [isShowOnlyMyPosts, setIsShowOnlyMyPosts] = useState(false);
  const [posts, setPosts] = useState<IPost[]>([]);
  const [page, setPage] = useState(1);
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const scrolledElementRef = useRef<HTMLDivElement | null>(null);
  const [openEditPostDialog, setOpenEditPostDialog] = useState(false);
  const [postToEdit, setPostToEdit] = useState<PostToEdit>();

  useEffect(() => {
    // Whenever the filters switch, reset pagination and jump back to the top so
    // the new dataset starts from page 1.
    setPosts([]);
    setPage(1);
    scrolledElementRef.current!.scrollTop = 0;
  }, [selectedCity, , selectedType, isShowOnlyMyPosts]);

  useEffect(() => {
    // `determinePostsRequest` returns a factory so we can reuse the same fetch
    // logic for either the feed or \"my posts\" without duplicating pagination.
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
  }, [page, selectedCity, selectedType, isShowOnlyMyPosts]);

  useEffect(() => {
    const handleScroll = () => {
      const gridElement = scrolledElementRef.current as HTMLDivElement;
      if (gridElement) {
        const { scrollTop, scrollHeight, clientHeight } = gridElement;
        const heightRemainToScroll = scrollHeight - scrollTop - clientHeight;
        const treshold = (scrollHeight - scrollTop) * 0.1;

        if (heightRemainToScroll <= treshold) {
          // Debounce by removing the listener until the next render; otherwise
          // fast scrolling could increment `page` multiple times.
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
    // Delay invoking the service call so callers can decide whether they need a
    // user feed or the global feed without repeating the HTTP wiring.
    if (isShowOnlyMyPosts) {
      return () => {
        return postsService.getByUser(page);
      };
    } else {
      return () => {
        return postsService.getByCityAndType(selectedCity, selectedType, page);
      };
    }
  };

  const handleCloseEditDialog = (isEdited = false) => {
    setOpenEditPostDialog(false);
    if (isEdited) {
      setPage(1);
      scrolledElementRef.current!.scrollTop = 0;
      // After editing, reload page 1 so the card immediately reflects the
      // server-side changes before users scroll again.
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
    // Convert the stored filename back into a File object so the edit form can
    // reuse the upload component without special casing server images.
    const picture = await fetchImageAndConvertToFile(post.image);

    setPostToEdit({
      picture,
      city: post.city,
      type: post.type,
      description: post.description,
      trainingLength: post.trainingLength,
      postId: post._id,
    });

    setOpenEditPostDialog(true);
  };

  return (
    <>
      <Stack sx={{ p: 4, gap: 2 }}>
        <Stack spacing={2} sx={{ mb: 3 }}>
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
            <>
              <SelectCity
                city={selectedCity}
                setCity={setSelectedCity}
                sx={{ width: "20vw", height: "5vh" }}
              />
              <SelectTrainingType
                type={selectedType}
                setType={setSelectedType}
                sx={{ width: "20vw", height: "5vh" }}
              />
            </>
          )}
        </Stack>

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
          {posts?.length && posts.map((post, index) => (
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
