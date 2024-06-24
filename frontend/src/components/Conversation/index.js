import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';

import useUserAxios from '../../hooks/useUserAxios';

import { StyledBadge } from '../styles';
import {
  handleSocketEvents,
  initializeSocket,
} from '../../sockets/initializeSocket';
import { API } from '../../api/base';
import { getUserByUserId } from '../../api/users';

export default function Conversation({ data }) {
  const [userData, setUserData] = useState(null);
  const [isOnline, setIsOnline] = useState(false);
  const [event, setEvent] = useState();

  const { i18n } = useTranslation();
  const { user, accessToken, axiosJWT } = useUserAxios(i18n.language);

  const userId = data.members.find((id) => id !== user?._id);

  const socket = initializeSocket(user?._id);
  handleSocketEvents(socket, setEvent);

  useEffect(() => {
    getUserByUserId(i18n.language, userId, setUserData, user?._id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
    const handleCheckUserOnline = async () => {
      try {
        const res = await axiosJWT.post(
          API.SOCKET.ONLINE(userId),
          {},
          {
            headers: {
              token: `Bearer ${accessToken}`,
              'Accept-Language': i18n.language,
            },
          },
        );
        setIsOnline(res.data.online);
      } catch (error) {
        setIsOnline(false);
      }
    };
    handleCheckUserOnline();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, event]);

  return (
    <Box display="flex" alignItems="center" gap={1.5}>
      {isOnline ? (
        <StyledBadge
          overlap="circular"
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          variant="dot"
        >
          <Avatar
            src={userData?.media?.url}
            alt="avatar"
            sx={{
              width: {
                xs: 50,
                sm: 55,
              },
              height: {
                xs: 50,
                sm: 55,
              },
            }}
          />
        </StyledBadge>
      ) : (
        <Avatar
          src={userData?.media?.url}
          alt="avatar"
          sx={{
            width: {
              xs: 50,
              sm: 55,
            },
            height: {
              xs: 50,
              sm: 55,
            },
          }}
        />
      )}

      <Box
        flexDirection="column"
        display={{
          xs: 'none',
          sm: 'flex',
        }}
      >
        <Typography variant="body1" fontWeight={700}>
          {userData?.nickname}
        </Typography>
        <Typography variant="caption">Last message</Typography>
      </Box>
    </Box>
  );
}
