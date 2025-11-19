import { useNavigate } from "react-router-dom";
import { Avatar, Button, Stack, Typography } from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { observer } from "mobx-react-lite";
import userStore from "../common/store/user.store";
import { config } from "../config";

const Profile = observer(() => {
  const { user } = userStore;
  const navigate = useNavigate();

  const editProfile = () => {
    navigate("/profile/edit");
  };

  return (
    <Stack sx={{ p: 10, gap: 4, alignItems: "center" }}>
      <Typography
        variant="h4"
        textAlign="center"
        color="secondary.main"
        fontWeight="bold"
      >
        Welcome {user?.fullName}!
      </Typography>
      <Avatar
        src={
          user?.profileImage
            ? config.uploadFolderUrl + user.profileImage
            : config.publicFolderUrl + "profile.png"
        }
        sx={{ width: 280, height: 280 }}
      ></Avatar>
      <Typography
        variant="h4"
        textAlign="center"
        color="secondary.main"
        fontWeight="bold"
      >
        {user?.homeCity
          ? `Subscribing For Restaurants In ${user?.homeCity}`
          : "Subscribing For All The Restaurants"}
      </Typography>
      <Button
        variant="contained"
        sx={{
          backgroundColor: "primary.main",
          color: "white",
          width: "15vw",
          height: "6vh",
          mt: 2,
          gap: 1,
          ":hover": { backgroundColor: "primary.main" },
        }}
        onClick={editProfile}
      >
        <Typography variant="h6" fontWeight="bold">
          Edit Profile
        </Typography>
        <EditOutlinedIcon />
      </Button>
    </Stack>
  );
});

export default Profile;
