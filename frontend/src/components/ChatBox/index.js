import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import InputEmoji from 'react-input-emoji';
import moment from 'moment';

import Tooltip from '@mui/material/Tooltip';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';

import SendRoundedIcon from '@mui/icons-material/SendRounded';
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded';

import { BaseApi } from '../../constants/constant';

import useUserAxios from '../../hooks/useUserAxios';
import { getMessages } from '../../utils/chatServices';
import { getUserByUserId } from '../../utils/userServices';

import newMessageSoundEffect from '../../assets/sounds/new-message.mp3';
import { BoxMessage, PaperMessage } from './styles';

export default function ChatBox({ chat, receivedMessage }) {
  const [userData, setUserData] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  const { user, accessToken, axiosJWT } = useUserAxios();
  const { t } = useTranslation(['message']);

  //   sound effects
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
      getUserByUserId(axiosJWT, userId, accessToken, setUserData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, chat]);

  useEffect(() => {
    if (chat !== null) {
      getMessages(axiosJWT, chat?._id, accessToken, setMessages);
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
          `${BaseApi}/message`,
          {
            senderId: user._id,
            message: newMessage,
            chatId: chat._id,
          },
          {
            headers: {
              token: `Bearer ${accessToken}`,
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
        <IconButton aria-label="menu">
          <MoreVertRoundedIcon />
        </IconButton>
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
        />
        <Button
          size="small"
          variant="contained"
          onClick={handleSendMessage}
          sx={{ minWidth: '24px', height: '100%' }}
        >
          <SendRoundedIcon fontSize="small" />
        </Button>
      </Box>
    </Box>
  );
}
