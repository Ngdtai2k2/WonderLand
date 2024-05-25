import React, { useEffect, useRef, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import ListItemButton from '@mui/material/ListItemButton';
import Avatar from '@mui/material/Avatar';

import CustomBox from '../CustomBox';
import LoadingCircularIndeterminate from '../Loading';

import { BaseApi } from '../../constants/constant';
import useUserAxios from '../../hooks/useUserAxios';
import { getFriendsList, refreshFriendList } from '../../utils/friendServices';

import { GridHiddenMobile, ListContainer, StyledBadge } from './styles';
import {
  handleSocketEvents,
  initializeSocket,
} from '../../sockets/initializeSocket';

export default function GridColumnLayout({ children }) {
  const [friendsList, setFriendsList] = useState([]);
  const [listUserIds, setListUserIds] = useState([]);
  const [friendOnline, setFriendOnline] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [event, setEvent] = useState(null);

  const page = useRef(1);
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
      <GridHiddenMobile item xs={12} md={3}>
        <CustomBox paddingTop={8}>111</CustomBox>
      </GridHiddenMobile>
      <Grid item xs={12} md={6}>
        {children}
      </Grid>
      <GridHiddenMobile
        item
        xs={12}
        md={3}
        marginTop={17}
        display="flex"
        alignItems="flex-end"
      >
        <Paper
          elevation={1}
          sx={{ position: 'fixed', padding: 1.5, width: '24%' }}
        >
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
        </Paper>
      </GridHiddenMobile>
    </Grid>
  );
}
