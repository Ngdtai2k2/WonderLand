import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@emotion/react';
import { toast } from 'react-toastify';

import AppBar from '@mui/material/AppBar';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Badge from '@mui/material/Badge';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';

import MenuIcon from '@mui/icons-material/Menu';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import FileUploadRoundedIcon from '@mui/icons-material/FileUploadRounded';
import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import SmsRoundedIcon from '@mui/icons-material/SmsRounded';

import ListNotifications from '../ListNotifications';
import DrawerList from '../../components/DrawerList';
import SearchForm from '../SearchForm';
import UserMenu from '../UserMenu';

import useUserAxios from '../../hooks/useUserAxios';
import { useToastTheme } from '../../constants/constant';
import { countUnreadNotifications } from '../../api/notifications';
import { countUnreadMessages } from '../../api/messages';
import { initializeSocket } from '../../sockets/initializeSocket';

export default function NavigationBar({ isAdmin, state }) {
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [anchorElNotifications, setAnchorElNotifications] = useState(null);
  const [anchorElSearch, setAnchorElSearch] = useState(null);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [totalUnreadNotifications, setTotalUnreadNotifications] = useState(0);
  const [totalUnreadMessages, setTotalUnreadMessages] = useState(0);
  const [eventChat, setEventChat] = useState();
  const [dataFromChild, setDataFromChild] = useState();

  const theme = useTheme();
  const navigate = useNavigate();
  const toastTheme = useToastTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const colorAppBar = isDarkMode ? '#f4f4f4' : '#121212';
  const backgroundColorAppBar = isDarkMode ? '#121212' : '#f4f4f4';
  const { t, i18n } = useTranslation(['navigation', 'home']);

  const { user, accessToken, axiosJWT } = useUserAxios(i18n.language);
  const socket = initializeSocket(user?._id);

  const toggleDrawer = (newOpen) => () => {
    setOpenDrawer(newOpen);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handelNavigate = (path) => {
    navigate(path);
  };

  useEffect(() => {
    socket.on('new-message', (data) => {
      setEventChat(data);
    });
    socket.on('action-delete-chat', (data) => {
      setEventChat(data);
    });
    socket.on('action-mark-messages', (data) => {
      setEventChat(data);
    });
  }, [socket]);

  useEffect(() => {
    if (user?._id) {
      countUnreadNotifications(
        user?._id,
        axiosJWT,
        accessToken,
        setTotalUnreadNotifications,
      );
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataFromChild, state]);

  useEffect(() => {
    if (user?._id)
      countUnreadMessages(
        user?._id,
        axiosJWT,
        accessToken,
        setTotalUnreadMessages,
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?._id, eventChat]);

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
              fontSize="20px"
              display={{
                xs: 'none',
                sm: 'block',
              }}
            >
              {t('home:site_name')}
            </Link>
            <Link
              href="/"
              underline="none"
              width="fit-content"
              display={{
                xs: 'flex',
                sm: 'none',
              }}
              alignItems="center"
            >
              <HomeRoundedIcon />
            </Link>
          </Typography>
          <IconButton
            aria-label="search"
            id="button-search"
            onClick={(event) => setAnchorElSearch(event.currentTarget)}
          >
            <SearchRoundedIcon />
          </IconButton>
          {/* search form */}
          <Menu
            id="search-form"
            anchorEl={anchorElSearch}
            open={Boolean(anchorElSearch)}
            onClose={() => setAnchorElSearch(null)}
            keepMounted
            MenuListProps={{
              'aria-labelledby': 'button-search',
            }}
          >
            <SearchForm onClose={() => setAnchorElSearch(null)} />
          </Menu>
          {/* notification */}
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
          {/* chat */}
          <IconButton
            aria-label="chat"
            onClick={() => {
              if (user) {
                navigate('/chat');
              } else {
                toast.warning(t('message:need_login'), toastTheme);
              }
            }}
          >
            <Badge
              color="error"
              badgeContent={totalUnreadMessages}
              max={9}
              sx={{ '& .MuiBadge-badge': { top: '-2px' } }}
            >
              <SmsRoundedIcon fontSize="small" />
            </Badge>
          </IconButton>
          {/* created post */}
          <Tooltip title={t('navigation:create_post')}>
            <IconButton onClick={() => handelNavigate('/create/post')}>
              <FileUploadRoundedIcon />
            </IconButton>
          </Tooltip>
          {/* button open menu */}
          <Tooltip title={t('navigation:open_menu')}>
            <IconButton
              onClick={(event) => {
                setAnchorElUser(event.currentTarget);
              }}
              sx={{ p: 0, m: 1 }}
            >
              <Avatar
                src={user?.media?.url}
                alt={'Avatar of ' + user?.fullname}
              />
            </IconButton>
          </Tooltip>
          {/* menu user */}
          <UserMenu
            anchorEl={anchorElUser}
            setAnchorEl={setAnchorElUser}
            handleClose={handleCloseUserMenu}
          />
        </Toolbar>
      </AppBar>
    </Box>
  );
}
