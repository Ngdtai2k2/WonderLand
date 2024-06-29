import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import InputEmoji from 'react-input-emoji';
import { useTheme } from '@emotion/react';
import { toast } from 'react-toastify';
import LazyLoad from 'react-lazyload';

import Box from '@mui/material/Box';
import Menu from '@mui/material/Menu';
import Badge from '@mui/material/Badge';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';

import SendRoundedIcon from '@mui/icons-material/SendRounded';
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded';
import DeleteForeverRoundedIcon from '@mui/icons-material/DeleteForeverRounded';
import MarkChatUnreadRoundedIcon from '@mui/icons-material/MarkChatUnreadRounded';
import AttachFileRoundedIcon from '@mui/icons-material/AttachFileRounded';

import MessageItem from '../Message';

import { API } from '../../api/base';
import { useToastTheme } from '../../constants/constant';

import useUserAxios from '../../hooks/useUserAxios';
import { deleteChat, getMessages } from '../../api/chats';
import { getUserByUserId } from '../../api/users';
import { markMessageByChatWithType } from '../../api/messages';

import newMessageSoundEffect from '../../assets/sounds/new-message.mp3';
import {
  BoxImagePreview,
  BoxMessage,
  BoxMessageContainer,
  ButtonUploadFile,
  ImagePreview,
} from './styles';
import { VisuallyHiddenInput } from '../../pages/styles';
import './inputEmoji.css';

export default function ChatBox({ chat, receivedMessage }) {
  const [userData, setUserData] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [isMarkRead, setIsMarkRead] = useState(false);
  const [file, setFile] = useState(null);
  const [typeFile, setTypeFile] = useState(false);

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

  const handleClearFile = () => {
    setFile(null);
    document.getElementById('file').value = '';
  };

  const handleSendMessage = async () => {
    try {
      if (newMessage.trim() !== '' || file) {
        const formData = new FormData();
        if (file) {
          formData.append('file', file);
        }
        formData.append('message', newMessage);
        formData.append('senderId', user._id);
        formData.append('chatId', chat._id);
        const response = await axiosJWT.post(API.MESSAGE.BASE, formData, {
          headers: {
            token: `Bearer ${accessToken}`,
            'Accept-Language': i18n.language,
            'Content-Type': 'multipart/form-data',
          },
        });
        setMessages([...messages, response.data]);
        setNewMessage('');
        handleClearFile();
      }
    } catch (error) {
      toast.error(error.response.data.message, toastTheme);
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
          <LazyLoad height={50} once>
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
          </LazyLoad>
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
      <BoxMessageContainer>
        {messages.length === 0 ? (
          <Box
            display="flex"
            justifyContent="center"
            flexDirection="column"
            alignItems="center"
          >
            <LazyLoad height={60} once>
              <Avatar
                src={userData?.media?.url}
                sx={{ width: 60, height: 60 }}
              />
            </LazyLoad>
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
              /* sender */
              <BoxMessage
                ref={scroll}
                justifyContent="flex-end"
                marginRight={1}
                key={message._id}
              >
                <MessageItem
                  mediaUrl={message?.media?.url}
                  mediaType={message?.media?.type}
                  message={message.message}
                  createdAt={message.createdAt}
                  isSender={true}
                />
              </BoxMessage>
            ) : (
              /* receiver */
              <BoxMessage
                ref={scroll}
                justifyContent="flex-start"
                marginLeft={1}
                key={message._id}
              >
                <MessageItem
                  mediaUrl={message?.media?.url}
                  mediaType={message?.media?.type}
                  message={message.message}
                  createdAt={message.createdAt}
                  isSender={false}
                />
              </BoxMessage>
            ),
          )
        )}
      </BoxMessageContainer>
      {/* preview media upload */}
      {file && (
        <BoxImagePreview marginTop={2}>
          <Badge
            badgeContent="x"
            color="error"
            onClick={() => handleClearFile()}
            sx={{ cursor: 'pointer' }}
          >
            {typeFile ? (
              <ImagePreview src={URL.createObjectURL(file)} accept="" alt="" />
            ) : (
              <video autoPlay loop muted width="220" controls>
                <source src={URL.createObjectURL(file)} type="" />
              </video>
            )}
          </Badge>
        </BoxImagePreview>
      )}
      {/* chat input */}
      <Box display="flex" justifyContent="center" flexDirection="column">
        <Box display="flex" alignItems="center">
          <ButtonUploadFile
            size="small"
            component="label"
            role={undefined}
            variant="outlined"
            tabIndex={-1}
          >
            <VisuallyHiddenInput
              type="file"
              id="file"
              name="file"
              accept="image/*,video/*"
              onChange={(event) => {
                const files = event.currentTarget.files[0];
                URL.revokeObjectURL(files);
                setFile(files);
                setTypeFile(files.type.startsWith('image/'));
              }}
            />
            <AttachFileRoundedIcon fontSize="small" />
          </ButtonUploadFile>
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
    </Box>
  );
}
