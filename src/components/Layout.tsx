import { useState, type MouseEvent } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
} from "@mui/material";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import { observer } from "mobx-react-lite";
import NavButton from "./NavButton";
import type { LinkItem } from "../common/types";
import authService from "../services/authService";
import userStore from "../common/store/user.store";
import { config } from "../config";

/**
 * Root layout component that wraps all authenticated pages.
 * Renders the top AppBar with navigation links, a user avatar menu (Profile / Logout),
 */
const pages: Array<LinkItem> = [
  {
    path: "/",
    title: "Explore",
  },
  {
    path: "/upload",
    title: "Upload",
  },
  {
    path: "/calories/burn",
    title: "Calculate Calories",
  },
  {
    path: "/likedPosts",
    title: "Liked Posts"
  }
];

const settings: Array<LinkItem> = [
  {
    path: "/profile/edit",
    title: "Profile",
  },
  {
    path: "/login",
    title: "Logout",
    callback: () => {
      const { request } = authService.logout();

      request
        .then(() => {})
        .catch((err) => {
          console.log(err);
        });
    },
  },
];

const Layout = observer(() => {
  const { user } = userStore;
  const navigate = useNavigate();

  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

  const openUserMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const closeUserMenu = () => {
    setAnchorElUser(null);
  };
  const selectMenuOption = (path: string) => {
    closeUserMenu();
    navigate(path);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <AppBar
        position="static"
        sx={{
          background: "linear-gradient(90deg, #0d47a1 0%, #1976d2 100%)",
          boxShadow: 3,
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 3,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <FitnessCenterIcon sx={{ color: "white", fontSize: 30 }} />

            <Typography
              variant="h5"
              sx={{
                fontWeight: 600,
                color: "white",
                letterSpacing: 0.5,
              }}
            >
              TrainUp
            </Typography>
          </Box>

          <Box
            sx={{
              flexGrow: 1,
              display: "flex",
              justifyContent: "flex-start",
              ml: 4,
              gap: 2,
            }}
          >
            {pages.map((page) => (
              <NavButton key={page.title} path={page.path} title={page.title} />
            ))}
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <IconButton
              onClick={openUserMenu}
              sx={{
                p: 0,
                "&:hover": {
                  transform: "scale(1.05)",
                  transition: "0.15s",
                },
              }}
            >
              <Avatar
                src={
                  user?.profileImage
                    ? config.uploadFolderUrl + user.profileImage
                    : config.publicFolderUrl + "profile.png"
                }
                sx={{
                  width: 40,
                  height: 40,
                  border: "2px solid rgba(255,255,255,0.7)",
                }}
              />
            </IconButton>

            <Menu
              id="menu-appbar"
              anchorEl={anchorElUser}
              sx={{ mt: "45px" }}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              open={Boolean(anchorElUser)}
              onClose={closeUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem
                  key={setting.title}
                  onClick={() => {
                    setting.callback && setting.callback();
                    selectMenuOption(setting.path);
                  }}
                  sx={{
                    px: 3,
                    py: 1.5,
                    "&:hover": { bgcolor: "primary.light", color: "white" },
                  }}
                >
                  <Typography textAlign="center" sx={{ fontWeight: 500 }}>
                    {setting.title}
                  </Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      <Box sx={{ flex: 1, overflowY: "auto" }}>
        <Outlet />
      </Box>
    </Box>
  );
});

export default Layout;
