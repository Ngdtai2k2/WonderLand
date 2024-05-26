import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import InfiniteScroll from 'react-infinite-scroll-component';
import moment from 'moment';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ListItem from '@mui/material/ListItem';
import LoadingButton from '@mui/lab/LoadingButton';

import PersonRemoveRoundedIcon from '@mui/icons-material/PersonRemoveRounded';

import LoadingCircularIndeterminate from '../../components/Loading';
import ConfirmDialog from '../../components/Dialog';

import { getFriendsList, refreshFriendList } from '../../utils/friendServices';
import { useToastTheme, BaseApi } from '../../constants/constant';
import useUserAxios from '../../hooks/useUserAxios';
import {
  AvatarFriendList,
  BoxInfo,
  ListContainer,
  ListItemButtonContainer,
  TypographyCenter,
} from './styles';

export default function FriendsListTab() {
  const [friendsList, setFriendList] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingDelete, setIsLoadingDelete] = useState({});
  const [friendDeleted, setFriendDeleted] = useState([]);
  const [openModalConfirm, setOpenModalConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const toastTheme = useToastTheme();
  const navigate = useNavigate();
  const page = useRef(1);
  const { user, accessToken, axiosJWT } = useUserAxios();

  useEffect(() => {
    document.title = 'Friends List';
  }, []);

  useEffect(() => {
    if (user) {
      getFriendsList(
        `${BaseApi}/friend`,
        axiosJWT,
        accessToken,
        page,
        user,
        setFriendList,
        friendsList,
        setHasMore,
        setIsLoading,
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
      setIsLoadingDelete((prevState) => ({
        ...prevState,
        [friendId]: false,
      }));
    }
  };

  return (
    <>
      <Box gap={2}>
        <ListContainer id="friend-list">
          {isLoading ? (
            <LoadingCircularIndeterminate />
          ) : (
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
                    setFriendList,
                    friendsList,
                    setHasMore,
                  );
                }
              }}
              hasMore={hasMore}
              loader={<LoadingCircularIndeterminate />}
              refreshFunction={() =>
                refreshFriendList(
                  `${BaseApi}/friend`,
                  axiosJWT,
                  accessToken,
                  page,
                  user,
                  setFriendList,
                  setHasMore,
                )
              }
              pullDownToRefresh
              endMessage={
                friendsList?.length === 0 ? (
                  <TypographyCenter variant="caption">
                    Opp! It's sad that you haven't made anyone!
                  </TypographyCenter>
                ) : (
                  <TypographyCenter variant="caption">
                    Ohhh! Make friends to expand your friend list 😘
                  </TypographyCenter>
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
          )}
        </ListContainer>
      </Box>
    </>
  );
}
