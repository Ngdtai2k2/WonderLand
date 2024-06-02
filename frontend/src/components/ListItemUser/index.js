import React from 'react';
import { useTranslation } from 'react-i18next';

import ListItemButton from '@mui/material/ListItemButton';
import Typography from '@mui/material/Typography';
import ListItem from '@mui/material/ListItem';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

import useUserAxios from '../../hooks/useUserAxios';
import { handleCreateConversation } from '../../utils/chatServices';
import { useToastTheme } from '../../constants/constant';
import { useNavigate } from 'react-router-dom';

export default function ListItemUser({
  _id,
  nickname,
  avatar,
  isFriend,
  totalFriend,
}) {
  const toastTheme = useToastTheme();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation(['search']);
  const { user, accessToken, axiosJWT } = useUserAxios(i18n.language);

  const handleChat = async (friendId) => {
    const data = await handleCreateConversation(
      user._id,
      friendId,
      toastTheme,
      axiosJWT,
      accessToken,
    );
    if (data) {
      navigate(`/chat?chat_id=${data._id}`);
    }
  };
  return (
    <ListItem
      key={_id}
      secondaryAction={
        _id !== user?._id && (
          <Button
            edge="end"
            variant="outlined"
            size="small"
            color="info"
            sx={{ width: '84px' }}
            onClick={() => handleChat(_id)}
          >
            {t('search:message')}
          </Button>
        )
      }
      disablePadding
      sx={{ marginBottom: 1 }}
    >
      <ListItemButton
        sx={{
          display: 'flex',
          alignItems: 'center',
          borderRadius: '5px',
          gap: 1,
        }}
        dense
        onClick={() => navigate(`/u/${nickname || _id}`)}
      >
        <Avatar src={avatar} sx={{ height: 60, width: 60 }} />
        <Stack>
          <Typography variant="body1" fontWeight={600}>
            {nickname}
          </Typography>
          {isFriend && (
            <Typography variant="body2">
              {t('search:friend')}
              {totalFriend > 0 &&
                ` · ${totalFriend} ${t('search:total_friend')}`}
            </Typography>
          )}
        </Stack>
      </ListItemButton>
    </ListItem>
  );
}
