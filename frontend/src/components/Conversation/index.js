import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';

import { useToastTheme, BaseApi } from '../../constants/constant';
import useUserAxios from '../../hooks/useUserAxios';

import { StyledBadge } from '../styles';

export default function Conversation({ data }) {
  const [userData, setUserData] = useState(null);

  const toastTheme = useToastTheme();
  const { user, accessToken, axiosJWT } = useUserAxios();

  useEffect(() => {
    const userId = data.members.find((id) => id !== user?._id);

    const getUserByUserId = async () => {
      try {
        const response = await axiosJWT.get(`${BaseApi}/user/${userId}`, {
          headers: {
            token: `Bearer ${accessToken}`,
          },
        });
        setUserData(response.data.user);
      } catch (error) {
        toast.error(error.response.data.message, toastTheme);
      }
    };
    getUserByUserId();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <Box display="flex" alignItems="center" gap={1.5}>
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
