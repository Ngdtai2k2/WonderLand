import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import InfiniteScroll from 'react-infinite-scroll-component';
import moment from 'moment';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import LoadingButton from '@mui/lab/LoadingButton';

import PersonRemoveRoundedIcon from '@mui/icons-material/PersonRemoveRounded';

import LoadingCircularIndeterminate from '../../components/Loading';
import ConfirmDialog from '../../components/Dialog';

import { useToastTheme, BaseApi } from '../../constants/constant';
import useUserAxios from '../../hooks/useUserAxios';

export default function FriendsListTab() {
  const [friendsList, setFriendList] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingDelete, setIsLoadingDelete] = useState({});
  const [friendDeleted, setFriendDeleted] = useState([]);
  const [openModalConfirm, setOpenModalConfirm] = useState(false);

  const toastTheme = useToastTheme();
  const navigate = useNavigate();
  const page = useRef(1);
  const { user, accessToken, axiosJWT } = useUserAxios();

  useEffect(() => {
    document.title = 'Friends List';
  }, []);

  const getFriendsList = async () => {
    await axiosJWT
      .post(`${BaseApi}/friend/${user?._id}?_page=${page.current}&_limit=10&request_user=${user?._id}`, {
        headers: {
          token: `Bearer ${accessToken}`,
        },
      })
      .then((res) => {
        if (res.data.docs.length === 0) {
          setFriendList([...friendsList]);
          setHasMore(false);
        } else {
          setFriendList([...friendsList, ...res.data.docs]);
          setHasMore(res.data.docs.length === 10);
          page.current = page.current + 1;
        }
      });
  };

  const refresh = () => {
    page.current = 1;
    setFriendList([]);
    setHasMore(true);
    getFriendsList();
  };

  useEffect(() => {
    if (user) {
      getFriendsList();
    } else {
      toast.warning(
        'You need to be logged in to access this page!',
        toastTheme,
      );
      navigate('/');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDeleteFriend = async (friendId) => {
    try {
      setIsLoadingDelete((prevState) => ({
        ...prevState,
        [friendId]: true,
      }));
      if (!user) {
        return toast.warning(
          'You need to be signed in to perform this action!',
          toastTheme,
        );
      }
      const response = await axiosJWT.post(
        `${BaseApi}/friend/delete-friend?request_user=${user?._id}`,
        {
          userId: user._id,
          friendId: friendId,
        },
        {
          headers: {
            token: `Bearer ${accessToken}`,
          },
        },
      );
      setFriendDeleted([...friendDeleted, friendId]);
      toast.success(response.data.message, toastTheme);
    } catch (error) {
      toast.error(error.response.data.message, toastTheme);
    } finally {
      setIsLoadingDelete((prevState) => ({
        ...prevState,
        [friendId]: false,
      }));
    }
  };

  return (
    <>
      <Box gap={2}>
        <List
          sx={{
            width: '100%',
            maxHeight: '80vh',
            overflowY: 'auto',
            overflowX: 'hidden',
          }}
          id="friend-list"
        >
          <InfiniteScroll
            dataLength={friendsList.length}
            next={getFriendsList}
            hasMore={hasMore}
            loader={<LoadingCircularIndeterminate />}
            refreshFunction={refresh}
            pullDownToRefresh
            endMessage={
              friendsList?.length === 0 ? (
                <Typography
                  variant="caption"
                  display="flex"
                  justifyContent="center"
                >
                  Opp! It's sad that you haven't made anyone!
                </Typography>
              ) : (
                <Typography
                  variant="caption"
                  display="flex"
                  justifyContent="center"
                  fontSize={12}
                >
                  Ohhh! Make friends to expand your friend list 😘
                </Typography>
              )
            }
            scrollableTarget="friend-list"
          >
            {friendsList &&
              friendsList?.map((friend, index) => {
                return (
                  !friendDeleted.includes(friend._id) && (
                    <ListItem
                      key={index}
                      secondaryAction={
                        <LoadingButton
                          loading={isLoadingDelete[friend._id] || false}
                          loadingPosition="start"
                          startIcon={
                            <PersonRemoveRoundedIcon fontSize="small" />
                          }
                          variant="outlined"
                          edge="end"
                          size="big"
                          onClick={() => setOpenModalConfirm(true)}
                          sx={{ fontSize: 12, paddingX: 1.2 }}
                        >
                          Unfriend
                        </LoadingButton>
                      }
                      disablePadding
                      sx={{ marginY: 1, paddingX: 1 }}
                    >
                      <ConfirmDialog
                        open={openModalConfirm}
                        handleClose={() => setOpenModalConfirm(false)}
                        title="Confirm unfriend 🤔"
                        handleConfirm={() => handleDeleteFriend(friend._id)}
                        description="Are you sure you want to end this friendship and all the shared memories 😭?"
                      />
                      <ListItemButton
                        dense
                        sx={{ gap: 2, display: 'flex', borderRadius: 1 }}
                        onClick={() => navigate(`/u/${friend.nickname}`)}
                      >
                        <Avatar
                          src={friend?.media?.url}
                          alt="avatar"
                          sx={{ width: 60, height: 60 }}
                          variant="rounded"
                        />
                        <Box>
                          <Box
                            display="flex"
                            flexDirection={{
                              xs: 'column',
                              sm: 'row',
                            }}
                            gap={{
                              xs: 0,
                              sm: 0.5,
                            }}
                          >
                            <Typography variant="body1" fontWeight={700}>
                              {friend.nickname}
                            </Typography>
                            <Typography variant="caption" fontSize={10}>
                              Joined {moment(friend.createdAt).fromNow()}
                            </Typography>
                          </Box>
                          <Typography variant="body1">
                            {friend.about.length > 30
                              ? friend.about.slice(0, 30) + '...'
                              : friend.about}
                          </Typography>
                        </Box>
                      </ListItemButton>
                    </ListItem>
                  )
                );
              })}
          </InfiniteScroll>
        </List>
      </Box>
    </>
  );
}
