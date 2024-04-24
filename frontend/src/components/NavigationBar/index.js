import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTheme } from '@emotion/react';

import { useColorScheme } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Switch from '@mui/material/Switch';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';

import MenuIcon from '@mui/icons-material/Menu';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import FileUploadRoundedIcon from '@mui/icons-material/FileUploadRounded';
import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded';

import { createAxios } from '../../createInstance';
import { logOut } from '../../redux/apiRequest/authApi';
import { logOutSuccess } from '../../redux/slice/userSlice';
import DrawerList from '../../components/DrawerList';
import ModalAuth from '../../pages/modalAuth';

export default function NavigationBar() {
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const { mode, setMode } = useColorScheme();

  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const backgroundColorAppBar = isDarkMode ? '#121212' : '#f4f4f4';
  const colorAppBar = isDarkMode ? '#f4f4f4' : '#121212';

  const user = useSelector((state) => state.auth.login?.currentUser);
  const accessToken = user?.accessToken;
  const id = user?._id;
  const device = user?.device;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  let axiosJWT = createAxios(user, dispatch, logOutSuccess);

  const toggleDrawer = (newOpen) => () => {
    setOpenDrawer(newOpen);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = () => {
    handleCloseUserMenu();
    logOut(dispatch, id, device, navigate, accessToken, axiosJWT);
  };

  const handelNavigate = (path) => {
    navigate(path);
  };

  const handleOpenModal = () => {
    setOpenModal(true);
    handleCloseUserMenu();
  };
  const handleCloseModal = () => setOpenModal(false);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="fixed"
        sx={{ backgroundColor: backgroundColorAppBar, color: colorAppBar }}
      >
        <Toolbar variant="dense">
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={toggleDrawer(true)}
          >
            <MenuIcon />
          </IconButton>
          <Drawer open={openDrawer} onClose={toggleDrawer(false)}>
            <Box
              sx={{ width: 250 }}
              role="presentation"
              onClick={toggleDrawer(false)}
            >
              <DrawerList />
            </Box>
          </Drawer>
          <Typography
            variant="body1"
            fontWeight={700}
            component="div"
            sx={{ flexGrow: 1 }}
          >
            <Link href="/" underline="none" variant="inherit">
              Wonder Land
            </Link>
          </Typography>
          <IconButton aria-label="search">
            <SearchRoundedIcon />
          </IconButton>
          <IconButton aria-label="search">
            <NotificationsRoundedIcon />
          </IconButton>
          <Tooltip title="Created post">
            <IconButton onClick={() => handelNavigate('/create/post')}>
              <FileUploadRoundedIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Open menu">
            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0, m: 1 }}>
              <Avatar
                src={user?.media?.url}
                alt={'Avatar of ' + user?.fullname}
              />
            </IconButton>
          </Tooltip>
          <Menu
            sx={{ mt: '40px' }}
            id="menu-appbar"
            anchorEl={anchorElUser}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorElUser)}
            onClose={handleCloseUserMenu}
          >
            {user ? null : (
              <MenuItem onClick={handleOpenModal}>Signup or Login</MenuItem>
            )}
            <ModalAuth
              openModal={openModal}
              handleCloseModal={handleCloseModal}
            />
            <MenuItem onClick={() => handelNavigate('/profile/' + user?._id)}>
              Profile
            </MenuItem>
            <MenuItem onClick={() => handelNavigate('/settings')}>
              Settings
            </MenuItem>
            <MenuItem
              onClick={() => setMode(mode === 'light' ? 'dark' : 'light')}
            >
              <Typography>Dark mode</Typography>
              <Switch
                sx={{ marginLeft: 2 }}
                size="small"
                checked={mode === 'light' ? false : true}
              />
            </MenuItem>
            {user ? <MenuItem onClick={handleLogout}>Logout</MenuItem> : null}
          </Menu>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
