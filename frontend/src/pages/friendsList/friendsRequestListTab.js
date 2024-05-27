import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroll-component';
import moment from 'moment';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ListItem from '@mui/material/ListItem';
import LoadingButton from '@mui/lab/LoadingButton';

import LoadingCircularIndeterminate from '../../components/Loading';

import { BaseApi, useToastTheme } from '../../constants/constant';
import useUserAxios from '../../hooks/useUserAxios';
import { getFriendsList, refreshFriendList } from '../../utils/friendServices';
import {
  AvatarFriendList,
  BoxInfo,
  ListContainer,
  ListItemButtonContainer,
  TypographyCenter,
} from './styles';
import ConfirmDialog from '../../components/Dialog';

export default function FriendsRequestListTab() {
  const [friendsRequestList, setFriendRequestList] = useState([]);
  const [isLoading, setIsLoading] = useState({});
  const [friendAccepted, setFriendAccepted] = useState([]);
  const [friendDeleted, setFriendDeleted] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [openModalConfirm, setOpenModalConfirm] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [isLoadingList, setIsLoadingList] = useState(false);

  const page = useRef(1);
  const navigate = useNavigate();
  const toastTheme = useToastTheme();
  const { user, accessToken, axiosJWT } = useUserAxios();

  useEffect(() => {
    document.title = 'Friends Request List';
  }, []);

  const url = `${BaseApi}/friend/request-friend`;

  useEffect(() => {
    if (user) {
      getFriendsList(
        url,
        axiosJWT,
        accessToken,
        page,
        user,
        setFriendRequestList,
        friendsRequestList,
        setHasMore,
        setIsLoadingList,
      );
    } else {
      toast.warning(
        'You need to be logged in to access this page!',
        toastTheme,
      );
      navigate('/');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAcceptFriendRequest = async (friendId) => {
    try {
      setIsLoading({
        ...isLoading,
        [friendId]: false,
      });
      if (!user) {
        return toast.warning(
          'You need to be signed in to perform this action!',
          toastTheme,
        );
      }
      const response = await axiosJWT.post(
        `${BaseApi}/friend/accept-request`,
        {
          userId: user?._id,
          friendId: friendId,
        },
        {
          headers: {
            token: `Bearer ${accessToken}`,
          },
        },
      );
      setFriendAccepted([...friendAccepted, friendId]);
      toast.success(response.data.message, toastTheme);
    } catch (error) {
      toast.error(error.response.data.message, toastTheme);
    } finally {
      setIsLoading({
        ...isLoading,
        [friendId]: true,
      });
    }
  };

  const handleDeleteFriend = async (friendId) => {
    try {
      setIsLoading({
        ...isLoading,
        [friendId]: false,
      });
      if (!user) {
        return toast.warning(
          'You need to be signed in to perform this action!',
          toastTheme,
        );
      }
      const response = await axiosJWT.post(
        `${BaseApi}/friend/delete-friend?request_user=${user?._id}`,
        {
          userId: user?._id,
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
      setIsLoading({
        ...isLoading,
        [friendId]: true,
      });
    }
  };

  return (
    <>
      <Box gap={2}>
        <ListContainer id="friend-request-list">
          <InfiniteScroll
            dataLength={friendsRequestList.length}
            next={() => {
              if (hasMore) {
                getFriendsList(
                  url,
                  axiosJWT,
                  accessToken,
                  page,
                  user,
                  setFriendRequestList,
                  friendsRequestList,
                  setHasMore,
                );
              }
            }}
            hasMore={hasMore}
            loader={<LoadingCircularIndeterminate />}
            refreshFunction={() =>
              refreshFriendList(
                url,
                axiosJWT,
                accessToken,
                page,
                user,
                setFriendRequestList,
                setHasMore,
              )
            }
            pullDownToRefresh
            endMessage={
              friendsRequestList?.length === 0 ? (
                <TypographyCenter variant="caption">
                  Opp! It's sad that you haven't made anyone!
                </TypographyCenter>
              ) : (
                <TypographyCenter variant="caption">
                  Ohhh! You've seen all the friend requests list!
                </TypographyCenter>
              )
            }
            scrollableTarget="friend-request-list"
          >
            {friendsRequestList &&
              friendsRequestList?.map((friend, index) => {
                return (
                  !friendDeleted.includes(friend._id) && (
                    <ListItem
                      key={index}
                      secondaryAction={
                        friendAccepted.includes(friend._id) ? (
                          <>
                            <LoadingButton
                              variant="outlined"
                              color="error"
                              edge="end"
                              size="big"
                              onClick={() => setOpenModalConfirm(true)}
                              sx={{ fontSize: 12, paddingX: 1.2 }}
                            >
                              Unfriend
                            </LoadingButton>
                            <ConfirmDialog
                              open={openModalConfirm}
                              handleClose={() => setOpenModalConfirm(false)}
                              title="Confirm unfriend 🤔"
                              handleConfirm={() =>
                                handleDeleteFriend(friend._id)
                              }
                              description="Are you sure you want to end this friendship and all the shared memories 😭?"
                            />
                          </>
                        ) : (
                          <LoadingButton
                            variant="outlined"
                            color="success"
                            edge="end"
                            size="big"
                            onClick={() =>
                              handleAcceptFriendRequest(friend._id)
                            }
                            sx={{ fontSize: 12, paddingX: 1.2 }}
                          >
                            Accept
                          </LoadingButton>
                        )
                      }
                      disablePadding
                      sx={{ marginY: 1, paddingX: 1 }}
                    >
                      <ListItemButtonContainer
                        dense
                        onClick={() => navigate(`/u/${friend.nickname}`)}
                      >
                        <AvatarFriendList
                          src={friend?.media?.url}
                          alt="avatar"
                          variant="rounded"
                        />
                        <Box>
                          <BoxInfo>
                            <Typography variant="body1" fontWeight={700}>
                              {friend.nickname}
                            </Typography>
                            <Typography variant="caption" fontSize={10}>
                              Joined {moment(friend.createdAt).fromNow()}
                            </Typography>
                          </BoxInfo>
                          <Typography variant="body1">
                            {friend.about.length > 30
                              ? friend.about.slice(0, 30) + '...'
                              : friend.about}
                          </Typography>
                        </Box>
                      </ListItemButtonContainer>
                    </ListItem>
                  )
                );
              })}
          </InfiniteScroll>
        </ListContainer>
      </Box>
    </>
  );
}
