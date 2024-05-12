import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useTheme } from '@emotion/react';

import { useColorScheme } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Badge from '@mui/material/Badge';
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

import ListNotifications from '../ListNotifications';
import DrawerList from '../../components/DrawerList';
import ModalAuth from '../../pages/modalAuth';
import { useToastTheme, BaseApi } from '../../constants/constant';
import { createAxios } from '../../createInstance';
import { logOut } from '../../redux/apiRequest/authApi';
import { logOutSuccess } from '../../redux/slice/userSlice';
import useUserAxios from '../../hooks/useUserAxios';

export default function NavigationBar({ isAdmin, state }) {
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [anchorElNotifications, setAnchorElNotifications] = useState(null);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [totalUnreadNotifications, setTotalUnreadNotifications] = useState(0);
  const [dataFromChild, setDataFromChild] = useState();

  const { mode, setMode } = useColorScheme();

  const theme = useTheme();
  const toastTheme = useToastTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const backgroundColorAppBar = isDarkMode ? '#121212' : '#f4f4f4';
  const colorAppBar = isDarkMode ? '#f4f4f4' : '#121212';

  const { user, accessToken, axiosJWT } = useUserAxios();

  const id = user?._id;
  const device = user?.device;

  const dispatch = useDispatch();
  const navigate = useNavigate();

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
    logOut(
      dispatch,
      id,
      device,
      navigate,
      accessToken,
      createAxios(user, dispatch, logOutSuccess),
      toastTheme,
    );
  };

  const handelNavigate = (path) => {
    navigate(path);
  };

  const handleOpenModal = () => {
    setOpenModal(true);
    handleCloseUserMenu();
  };
  const handleCloseModal = () => setOpenModal(false);

  const countUnreadNotifications = async (userId) => {
    try {
      const response = await axiosJWT.post(
        `${BaseApi}/notification/count-unread?request_user=${userId}`,
        {
          id: userId,
        },
        {
          headers: {
            token: `Bearer ${accessToken}`,
          },
        },
      );
      setTotalUnreadNotifications(response.data.total);
    } catch (e) {
      setTotalUnreadNotifications(0);
    }
  };

  useEffect(() => {
    if (user?._id) {
      countUnreadNotifications(user?._id);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataFromChild, state]);

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
              <DrawerList isAdmin={isAdmin} />
            </Box>
          </Drawer>
          <Typography
            variant="body1"
            fontWeight={700}
            component="div"
            sx={{ flexGrow: 1 }}
          >
            <Link
              href="/"
              underline="none"
              variant="inherit"
              fontSize={{
                xs: '16px',
                md: '20px',
              }}
            >
              Wonder Land
            </Link>
          </Typography>
          <IconButton aria-label="search">
            <SearchRoundedIcon />
          </IconButton>
          <IconButton
            aria-label="notifications"
            onClick={(event) => setAnchorElNotifications(event.currentTarget)}
          >
            <Badge
              color="error"
              badgeContent={totalUnreadNotifications}
              max={9}
            >
              <NotificationsRoundedIcon />
            </Badge>
          </IconButton>
          <ListNotifications
            open={Boolean(anchorElNotifications)}
            handleClose={() => setAnchorElNotifications(null)}
            anchorEl={anchorElNotifications}
            setState={setDataFromChild}
            // When the socket event is captured, it will change the state to call the API again
            eventState={state}
          />
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
            {user
              ? [
                  <MenuItem
                    key="profile"
                    onClick={() => handelNavigate('/u/' + user?.nickname)}
                  >
                    Profile
                  </MenuItem>,
                  <MenuItem
                    key="settings"
                    onClick={() => handelNavigate('/settings')}
                  >
                    Settings
                  </MenuItem>,
                ]
              : null}
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
