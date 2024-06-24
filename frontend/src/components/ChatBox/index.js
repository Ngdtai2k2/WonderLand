import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import InputEmoji from 'react-input-emoji';
import { useTheme } from '@emotion/react';
import moment from 'moment';

import Box from '@mui/material/Box';
import Menu from '@mui/material/Menu';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';

import SendRoundedIcon from '@mui/icons-material/SendRounded';
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded';
import DeleteForeverRoundedIcon from '@mui/icons-material/DeleteForeverRounded';
import MarkChatUnreadRoundedIcon from '@mui/icons-material/MarkChatUnreadRounded';

import { API } from '../../api/base';
import { useToastTheme } from '../../constants/constant';

import useUserAxios from '../../hooks/useUserAxios';
import { deleteChat, getMessages } from '../../api/chats';
import { getUserByUserId } from '../../api/users';
import { markMessageByChatWithType } from '../../api/messages';

import newMessageSoundEffect from '../../assets/sounds/new-message.mp3';
import { BoxMessage, PaperMessage } from './styles';
import './inputEmoji.css';

export default function ChatBox({ chat, receivedMessage }) {
  const [userData, setUserData] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [isMarkRead, setIsMarkRead] = useState(false);

  const theme = useTheme();
  const isMode = theme.palette.mode === 'dark';
  const toastTheme = useToastTheme();
  const { t, i18n } = useTranslation(['message', 'chat']);
  const { user, accessToken, axiosJWT } = useUserAxios(i18n.language);

  // sound effects
  const messageSoundEffect = new Audio(newMessageSoundEffect);
  messageSoundEffect.volume = 0.5;

  useEffect(() => {
    if (receivedMessage !== null && receivedMessage.chatId === chat?._id) {
      setMessages([...messages, receivedMessage]);
      messageSoundEffect.play();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [receivedMessage]);

  useEffect(() => {
    scroll.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, chat, receivedMessage]);

  useEffect(() => {
    const userId = chat?.members?.find((id) => id !== user?._id);

    if (chat !== null) {
      getUserByUserId(i18n.language, userId, setUserData, user?._id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, chat]);

  useEffect(() => {
    if (chat !== null) {
      getMessages(
        i18n.language,
        axiosJWT,
        chat?._id,
        accessToken,
        setMessages,
        user,
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chat, user]);

  const handleChangeMessage = (newMessage) => {
    setNewMessage(newMessage);
  };

  const handleSendMessage = async () => {
    try {
      if (newMessage.trim() !== '') {
        const response = await axiosJWT.post(
          API.MESSAGE.BASE,
          {
            senderId: user._id,
            message: newMessage,
            chatId: chat._id,
          },
          {
            headers: {
              token: `Bearer ${accessToken}`,
              'Accept-Language': i18n.language,
            },
          },
        );
        setMessages([...messages, response.data]);
        setNewMessage('');
      }
    } catch (error) {
      // toast.error(error.response.data.message, toastTheme);
    }
  };

  const handleMarkMessageWithType = async (type) => {
    if (user && chat && messages.some((message) => message.isRead !== type)) {
      await markMessageByChatWithType(
        user?._id,
        chat?._id,
        type,
        axiosJWT,
        accessToken,
        setIsMarkRead,
      );
    }
  };

  const handleDeleteChat = async () => {
    await deleteChat(
      i18n.language,
      axiosJWT,
      accessToken,
      chat._id,
      user,
      toastTheme,
    );
  };

  const scroll = useRef();

  return userData === null ? (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100%"
    >
      <Typography variant="body1">{t('message:chat.note')}</Typography>
    </Box>
  ) : (
    <Box>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Box display="flex" gap={2} alignItems="center">
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
          <Typography variant="body1" fontWeight={700}>
            {userData?.nickname}
          </Typography>
        </Box>
        <IconButton
          aria-label="menu"
          onClick={(event) => setAnchorEl(event.currentTarget)}
        >
          <MoreVertRoundedIcon />
        </IconButton>
        <Menu
          id="menu-settings-messages"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
        >
          <MenuItem onClick={handleDeleteChat}>
            <ListItemIcon>
              <DeleteForeverRoundedIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>{t('chat:delete')}</ListItemText>
          </MenuItem>
          <MenuItem onClick={() => handleMarkMessageWithType(false)}>
            <ListItemIcon>
              <MarkChatUnreadRoundedIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>{t('chat:mark_unread')}</ListItemText>
          </MenuItem>
        </Menu>
      </Box>
      <Divider sx={{ marginY: 1 }} />
      {/* display message */}
      <Box
        height="60vh"
        maxHeight="60vh"
        sx={{ overflowX: 'hidden', overflowY: 'auto' }}
      >
        {messages.length === 0 ? (
          <Box
            display="flex"
            justifyContent="center"
            flexDirection="column"
            alignItems="center"
          >
            <Avatar src={userData?.media?.url} sx={{ width: 60, height: 60 }} />
            <Typography variant="body1" fontWeight={700}>
              {userData?.nickname}
            </Typography>
            <Typography variant="caption" fontWeight={500} marginTop={2}>
              {t('message:chat.can_message')} {userData?.nickname}.
            </Typography>
          </Box>
        ) : (
          messages.map((message) =>
            message.senderId === user?._id ? (
              <BoxMessage
                ref={scroll}
                justifyContent="flex-end"
                marginRight={1}
                key={message._id}
              >
                <PaperMessage
                  sx={{
                    backgroundColor: '#138aff',
                    color: '#ffffff',
                  }}
                >
                  <Tooltip title={moment(message.createdAt).fromNow()}>
                    <Typography variant="body1" fontWeight={500}>
                      {message.message}
                    </Typography>
                  </Tooltip>
                </PaperMessage>
              </BoxMessage>
            ) : (
              <BoxMessage
                justifyContent="flex-start"
                marginLeft={1}
                key={message._id}
              >
                <PaperMessage
                  sx={{
                    backgroundColor: '#4e4e4e',
                    color: '#ffffff',
                  }}
                >
                  <Tooltip title={moment(message.createdAt).fromNow()}>
                    <Typography variant="body1" fontWeight={500}>
                      {message.message}
                    </Typography>
                  </Tooltip>
                </PaperMessage>
              </BoxMessage>
            ),
          )
        )}
      </Box>
      {/* chat input */}
      <Box display="flex" alignItems="center">
        <InputEmoji
          value={newMessage}
          onChange={handleChangeMessage}
          cleanOnEnter
          onEnter={handleSendMessage}
          placeholder="Type a message"
          theme={theme.palette.mode}
          background={isMode ? '#1e1e1e' : 'white'}
          color={isMode ? 'white' : '#1e1e1e'}
          maxLength={1500}
          onFocus={() => handleMarkMessageWithType(true)}
        />
        <Button
          size="small"
          variant="contained"
          onClick={handleSendMessage}
          sx={{ minWidth: '24px', height: '100%', marginLeft: 1 }}
        >
          <SendRoundedIcon fontSize="small" />
        </Button>
      </Box>
    </Box>
  );
}
