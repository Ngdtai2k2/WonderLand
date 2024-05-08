import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import InfiniteScroll from 'react-infinite-scroll-component';
import moment from 'moment';

import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Menu from '@mui/material/Menu';
import Typography from '@mui/material/Typography';

import LoginRoundedIcon from '@mui/icons-material/LoginRounded';
import IconButton from '@mui/material/IconButton';
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded';

import LoadingCircularIndeterminate from '../Loading';
import {
  getNotificationByUserId,
  refresh,
} from '../../utils/notificationServices';
import { createAxios } from '../../createInstance';
import { useToastTheme, BaseApi } from '../../constants/constant';
import { MenuItemRounded } from './styles';

export default function ListNotifications({
  open,
  handleClose,
  anchorEl,
  setState,
  eventState,
}) {
  const [notifications, setNotifications] = useState([]);
  const [hasMore, setHasMore] = useState(true);

  const page = useRef(1);
  const toastTheme = useToastTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state) => state.auth.login?.currentUser);
  const accessToken = user?.accessToken;

  let axiosJWT = user ? createAxios(user, dispatch) : undefined;

  useEffect(() => {
    page.current = 1;
    if (user) {
      refresh(
        setNotifications,
        setHasMore,
        page,
        user?._id,
        accessToken,
        axiosJWT,
      );
    }
    // When the socket event is captured, it will change the state to call the API again
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventState]);

  const handleConfirmReadNotification = async (notificationId) => {
    try {
      await axiosJWT.post(
        `${BaseApi}/notification/confirm-read/${notificationId}?request_user=${user?._id}`,
        {
          headers: {
            token: `Bearer ${accessToken}`,
          },
        },
      );
      setState(notificationId);
    } catch (error) {
      toast.error(error.data.message, toastTheme);
    }
  };

  return (
    <Menu
      id="basic-menu"
      anchorEl={anchorEl}
      open={open}
      onClose={handleClose}
      PaperProps={{
        id: 'list-notifications-container',
        sx: {
          width: {
            xs: '100%',
            sm: '50%',
            md: '35%',
          },
          maxHeight: 200,
        },
      }}
    >
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        marginBottom={0.5}
      >
        <Typography
          variant="h6"
          fontWeight={700}
          marginX={1.2}
          marginBottom={1}
        >
          Notifications
        </Typography>
        <IconButton
          aria-label="menu settings notifications"
          size="small"
          sx={{ marginRight: 1 }}
        >
          <MoreVertRoundedIcon />
        </IconButton>
      </Box>
      {user ? (
        notifications?.length > 0 ? (
          <InfiniteScroll
            dataLength={notifications?.length}
            next={() => {
              if (hasMore) {
                getNotificationByUserId(
                  setNotifications,
                  notifications,
                  setHasMore,
                  page,
                  user?._id,
                  accessToken,
                  axiosJWT,
                );
              }
            }}
            hasMore={hasMore}
            loader={<LoadingCircularIndeterminate size={20} />}
            endMessage={
              notifications?.length === 0 ? (
                ''
              ) : (
                <Typography
                  variant="caption"
                  display="flex"
                  justifyContent="center"
                  fontSize={12}
                >
                  Ohhh! You have seen it all
                </Typography>
              )
            }
            scrollableTarget="list-notifications-container"
          >
            {notifications.map((notification) => (
              <MenuItemRounded
                key={notification._id}
                onClick={() => {
                  if (!notification.read) {
                    handleConfirmReadNotification(notification._id);
                    notification.read = true;
                  }
                  if (notification.type === 0) {
                    navigate(`/post/${notification.postId}`);
                  }
                }}
                selected={!notification.read}
              >
                <Box display="flex" gap={1.5}>
                  <Avatar
                    src={notification.image}
                    alt=""
                    sx={{ width: 50, height: 50 }}
                  />
                  <Box>
                    <Typography variant="body1" fontWeight={400}>
                      {notification.message}
                    </Typography>
                    <Typography variant="caption">
                      {moment(notification.createdAt).fromNow()}
                    </Typography>
                  </Box>
                </Box>
              </MenuItemRounded>
            ))}
          </InfiniteScroll>
        ) : (
          <Typography variant="body2" textAlign="center">
            You have no new notifications at all!
          </Typography>
        )
      ) : (
        <Box display="flex" flexDirection="column" alignItems="center">
          <LoginRoundedIcon sx={{ fontSize: 30 }} />
          <Typography variant="body2" textAlign="center">
            You need to be signed in to use this feature!
          </Typography>
        </Box>
      )}
    </Menu>
  );
}
