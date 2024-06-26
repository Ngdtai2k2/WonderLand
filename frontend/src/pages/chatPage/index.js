import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';

import CustomBox from '../../components/CustomBox';
import Conversation from '../../components/Conversation';
import ChatBox from '../../components/ChatBox';

import { initializeSocket } from '../../sockets/initializeSocket';

import useUserAxios from '../../hooks/useUserAxios';
import { getChats } from '../../api/chats';

export default function ChatPage() {
  const [chats, setChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [receivedMessage, setReceivedMessage] = useState(null);
  const [event, setEvent] = useState();

  const location = useLocation();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation('message');
  const { user, accessToken, axiosJWT } = useUserAxios(i18n.language);

  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const chatId = urlParams.get('chat_id');

  useEffect(() => {
    document.title = 'Chats - WonderLand';
  });

  const socket = initializeSocket(user?._id);
  useEffect(() => {
    socket.on('new-message', (data) => {
      setReceivedMessage(data);
    });

    socket.on('action-delete-chat', (data) => {
      setEvent(data);
      setCurrentChat(null);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket]);

  useEffect(() => {
    if (user) {
      getChats(i18n.language, axiosJWT, user?._id, accessToken, setChats);
    } else navigate('/');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, event, receivedMessage]);

  useEffect(() => {
    const chat = chats.find((chat) => chat._id === chatId);
    setCurrentChat(chat);
    if (!chat) setCurrentChat(null);
  }, [chatId, chats]);

  return (
    <CustomBox
      sx={{
        marginX: {
          xs: 1,
          sm: 1.5,
          md: 2,
        },
        marginTop: 10,
      }}
    >
      <Grid container spacing={1}>
        <Grid item xs={3}>
          <Paper
            sx={{
              p: 1,
              height: '100%',
            }}
          >
            <Typography variant="h6" fontWeight={700}>
              Chats
            </Typography>
            <TextField size="small" fullWidth placeholder="Search friends..." />
            <List
              sx={{ maxHeight: '80vh', overflowY: 'auto', overflowX: 'hidden' }}
            >
              {chats.length > 0 &&
                chats.map((chat) => (
                  <ListItem
                    disablePadding
                    key={chat._id}
                    sx={{ marginBottom: 1 }}
                    onClick={() => {
                      setCurrentChat(chat);
                      navigate(`${location.pathname}?chat_id=${chat._id}`);
                    }}
                  >
                    <ListItemButton sx={{ borderRadius: '5px', padding: 1 }}>
                      <Conversation data={chat} />
                    </ListItemButton>
                  </ListItem>
                ))}
            </List>
          </Paper>
        </Grid>
        <Grid item xs={9}>
          {currentChat ? (
            <Paper elevation={1} sx={{ p: 2, height: 'auto' }}>
              <ChatBox chat={currentChat} receivedMessage={receivedMessage} />
            </Paper>
          ) : (
            <Paper elevation={1} sx={{ p: 2, height: '100%' }}>
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                height="100%"
              >
                <Typography variant="body1">
                  {t('message:chat.note')}
                </Typography>
              </Box>
            </Paper>
          )}
        </Grid>
      </Grid>
    </CustomBox>
  );
}
