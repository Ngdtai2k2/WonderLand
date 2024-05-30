import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import axios from 'axios';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';

import { useToastTheme, BaseApi } from '../../constants/constant';
import useUserAxios from '../../hooks/useUserAxios';

import { StyledBadge } from '../styles';
import {
  handleSocketEvents,
  initializeSocket,
} from '../../sockets/initializeSocket';

export default function Conversation({ data }) {
  const [userData, setUserData] = useState(null);
  const [isOnline, setIsOnline] = useState(false);
  const [event, setEvent] = useState();

  const toastTheme = useToastTheme();
  const { i18n } = useTranslation();
  const { user, accessToken, axiosJWT } = useUserAxios(i18n.language);

  const userId = data.members.find((id) => id !== user?._id);

  const socket = initializeSocket(user?._id);
  handleSocketEvents(socket, setEvent);

  useEffect(() => {
    const getUserByUserId = async () => {
      try {
        const response = await axios.get(`${BaseApi}/user/${userId}`);
        setUserData(response.data.user);
      } catch (error) {
        toast.error(error.response.data.message, toastTheme);
      }
    };
    getUserByUserId();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
    const handleCheckUserOnline = async () => {
      try {
        const res = await axiosJWT.post(
          `${BaseApi}/socket/online/${userId}`,
          {},
          {
            headers: {
              token: `Bearer ${accessToken}`,
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
