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
import FoodIcon from "@mui/icons-material/Fastfood";
import { observer } from "mobx-react-lite";
import NavButton from "./NavButton";
import type { LinkItem } from "../common/types";
import authService from "../services/authService";
import userStore from "../common/store/user.store";
import { config } from "../config";

const pages: Array<LinkItem> = [
  {
    path: "/",
    title: "Explore",
  },
  {
    path: "/upload",
    title: "Upload",
  },
];

const settings: Array<LinkItem> = [
  {
    path: "/profile",
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
    <>
      <AppBar position="static">
        <Toolbar>
          <FoodIcon sx={{ color: "white" }} />
          <Typography variant="h6" component="div" color={"white"} ml={1}>
            Yummy
          </Typography>
          <Box sx={{ flexGrow: 1 }}>
            {pages.map((page) => (
              <NavButton path={page.path} title={page.title} key={page.title} />
            ))}
          </Box>
          <Box sx={{ flexGrow: 0 }}>
            <IconButton onClick={openUserMenu} sx={{ p: 0 }}>
              <Avatar
                src={
                  user?.profileImage
                    ? config.uploadFolderUrl + user.profileImage
                    : config.publicFolderUrl + "profile.png"
                }
              />
            </IconButton>
            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
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
                >
                  <Typography textAlign="center">{setting.title}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
      <Outlet />
    </>
  );
});

export default Layout;
