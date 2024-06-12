import React, { useEffect, useRef, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import InfiniteScroll from 'react-infinite-scroll-component';
import moment from 'moment';
import { useTranslation } from 'react-i18next';

import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Menu from '@mui/material/Menu';
import Typography from '@mui/material/Typography';

import LoginRoundedIcon from '@mui/icons-material/LoginRounded';
import IconButton from '@mui/material/IconButton';
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded';

import LoadingCircularIndeterminate from '../Loading';

import { API } from '../../api';
import {
  getNotificationByUserId,
  refresh,
} from '../../utils/notificationServices';
import { useToastTheme } from '../../constants/constant';
import useUserAxios from '../../hooks/useUserAxios';
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
  const navigate = useNavigate();
  const { t, i18n } = useTranslation(['navigation', 'message']);
  const lng = i18n.language;

  const { user, accessToken, axiosJWT } = useUserAxios(lng);

  const decodedToken = accessToken ? jwtDecode(accessToken) : null;
  const isAdmin = decodedToken ? decodedToken.isAdmin || false : false;

  useEffect(() => {
    page.current = 1;
    if (user) {
      getNotificationByUserId(
        i18n.language,
        setNotifications,
        notifications,
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
        API.NOTIFICATION.CONFIRM_READ(notificationId, user?._id),
        {},
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
          {t('navigation:notification')}
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
                  i18n.language,
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
                  {t('message:seen_all')}
                </Typography>
              )
            }
            refreshFunction={() =>
              refresh(
                i18n.language,
                setNotifications,
                setHasMore,
                page,
                user?._id,
                accessToken,
                axiosJWT,
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
                  } else if (notification.type === 3 && isAdmin) {
                    navigate(`/admin/reports`);
                  } else if (notification.type === 4) {
                    navigate(`/friends?tab_index=1`);
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
                    <Typography
                      variant="body1"
                      fontWeight={400}
                      sx={{ whiteSpace: 'pre-wrap' }}
                    >
                      {notification.messages[lng]}
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
            {t('message:no_notifications')}
          </Typography>
        )
      ) : (
        <Box display="flex" flexDirection="column" alignItems="center">
          <LoginRoundedIcon sx={{ fontSize: 30 }} />
          <Typography variant="body2" textAlign="center">
            {t('message:need_login')}
          </Typography>
        </Box>
      )}
    </Menu>
  );
}
