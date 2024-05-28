import React, { useEffect, useRef, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import ListItemButton from '@mui/material/ListItemButton';
import Avatar from '@mui/material/Avatar';

import LoadingCircularIndeterminate from '../Loading';
import WidgetImage from '../WidgetImage';
import ButtonBar from '../ButtonBar';
import WidgetBirthday from '../WidgetBirthday';

import { BaseApi, useToastTheme } from '../../constants/constant';
import useUserAxios from '../../hooks/useUserAxios';
import { getFriendsList, refreshFriendList } from '../../utils/friendServices';

import {
  handleSocketEvents,
  initializeSocket,
} from '../../sockets/initializeSocket';
import { GridHiddenMobile, ListContainer } from './styles';
import { PaperSticky, StyledBadge } from '../styles';
import { useNavigate } from 'react-router-dom';
import { handleCreateConversation } from '../../utils/chatServices';

export default function GridColumnLayout({ children }) {
  const [friendsList, setFriendsList] = useState([]);
  const [listUserIds, setListUserIds] = useState([]);
  const [friendOnline, setFriendOnline] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [event, setEvent] = useState(null);

  const page = useRef(1);
  const toastTheme = useToastTheme();
  const navigate = useNavigate();
  const { user, accessToken, axiosJWT } = useUserAxios();

  const socket = initializeSocket(user?._id);

  handleSocketEvents(socket, setEvent);
  useEffect(() => {
    if (user) {
      getFriendsList(
        `${BaseApi}/friend`,
        axiosJWT,
        accessToken,
        page,
        user,
        setFriendsList,
        friendsList,
        setHasMore,
        setIsLoading,
      );
    } else {
      setFriendsList([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const userIds = friendsList.map((friend) => friend._id);
    setListUserIds(userIds);
  }, [friendsList]);

  const handleCheckOnline = async (userIds) => {
    try {
      const response = await axiosJWT.post(
        `${BaseApi}/socket/online`,
        {
          userIds: userIds,
        },
        {
          headers: {
            token: `Bearer ${accessToken}`,
          },
        },
      );
      setFriendOnline([...response.data.online]);
    } catch (error) {
      setFriendOnline([]);
    }
  };

  useEffect(() => {
    if (!isLoading && user && friendsList.length > 0) {
      handleCheckOnline(listUserIds);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listUserIds, event]);

  return (
    <Grid container>
      {/* button bar */}
      <Grid item xs={12} marginBottom={2}>
        <ButtonBar />
      </Grid>
      <Grid item container xs={12}>
        <GridHiddenMobile
          item
          xs={12}
          sm={3}
          display="flex"
          flexDirection="column"
        >
          <WidgetImage />
          <PaperSticky
            elevation={1}
            sx={{
              top: 333,
              marginLeft: 1,
              padding: 1,
            }}
          >
            <WidgetBirthday />
          </PaperSticky>
        </GridHiddenMobile>
        <Grid item xs={12} sm={6}>
          {children}
        </Grid>
        <GridHiddenMobile item xs={12} sm={3}>
          <PaperSticky elevation={1} sx={{ top: 75, marginRight: 1.5 }}>
            <Typography variant="body1" fontWeight={600}>
              Contacts
            </Typography>
            <ListContainer id="list-contacts">
              {isLoading ? (
                <LoadingCircularIndeterminate size={24} />
              ) : friendsList && friendsList.length === 0 ? (
                <Typography variant="caption">
                  {user
                    ? 'No contacts, make friends to connect 🤘!'
                    : 'Sign in to experience more features 😉!'}
                </Typography>
              ) : (
                !isLoading && (
                  <InfiniteScroll
                    dataLength={friendsList.length}
                    next={() => {
                      if (hasMore) {
                        getFriendsList(
                          `${BaseApi}/friend`,
                          axiosJWT,
                          accessToken,
                          page,
                          user,
                          setFriendsList,
                          friendsList,
                          setHasMore,
                        );
                      }
                    }}
                    hasMore={hasMore}
                    loader={<LoadingCircularIndeterminate size={24} />}
                    pullDownToRefresh
                    refreshFunction={() => {
                      refreshFriendList(
                        `${BaseApi}/friend`,
                        axiosJWT,
                        accessToken,
                        page,
                        user,
                        setFriendsList,
                        setHasMore,
                      );
                    }}
                    scrollableTarget="list-contacts"
                  >
                    {friendsList.map((friend) => (
                      <ListItemButton
                        key={friend?._id}
                        sx={{ paddingX: 1, borderRadius: 1 }}
                        onClick={async () => {
                          const data = await handleCreateConversation(
                            user._id,
                            friend._id,
                            toastTheme,
                            axiosJWT,
                            accessToken,
                          );
                          if (data) {
                            navigate(`/chat?chat_id=${data._id}`);
                          }
                        }}
                      >
                        <Box display="flex" alignItems="center" gap={1.5}>
                          {friendOnline && friendOnline.includes(friend._id) ? (
                            <StyledBadge
                              overlap="circular"
                              anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'right',
                              }}
                              variant="dot"
                            >
                              <Avatar src={friend?.media?.url} alt="Avatar" />
                            </StyledBadge>
                          ) : (
                            <Avatar src={friend?.media?.url} alt="Avatar" />
                          )}

                          <Typography variant="body1" fontWeight={600}>
                            {friend?.nickname.length > 30
                              ? friend?.nickname.slice(0, 30) + '...'
                              : friend?.nickname}
                          </Typography>
                        </Box>
                      </ListItemButton>
                    ))}
                  </InfiniteScroll>
                )
              )}
            </ListContainer>
          </PaperSticky>
        </GridHiddenMobile>
      </Grid>
    </Grid>
  );
}
