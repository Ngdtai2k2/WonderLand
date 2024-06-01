import React, { useEffect, useRef, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import moment from 'moment';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ListItem from '@mui/material/ListItem';
import LoadingButton from '@mui/lab/LoadingButton';

import LoadingCircularIndeterminate from '../../components/Loading';

import { BaseApi, useToastTheme } from '../../constants/constant';
import useUserAxios from '../../hooks/useUserAxios';
import {
  acceptRequestAddFriend,
  deleteFriend,
  getFriendsList,
  refreshFriendList,
} from '../../utils/friendServices';
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
  const { t, i18n } = useTranslation(['friends', 'message', 'user']);
  const { user, accessToken, axiosJWT } = useUserAxios(i18n.language);

  useEffect(() => {
    document.title = t('friends:friends_request_list');
  }, [t]);

  const url = `${BaseApi}/friend/request-friend`;

  useEffect(() => {
    if (user) {
      getFriendsList(
        i18n.language,
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
      toast.warning(t('message:need_login'), toastTheme);
      navigate('/');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAcceptFriendRequest = async (friendId) => {
    setIsLoading({
      ...isLoading,
      [friendId]: false,
    });

    const result = await acceptRequestAddFriend(
      t,
      i18n.language,
      user,
      friendId,
      axiosJWT,
      accessToken,
      toastTheme,
    );

    if (result.success) {
      setFriendAccepted([...friendAccepted, friendId]);
      setIsLoading({
        ...isLoading,
        [friendId]: true,
      });
    }
  };

  const handleDeleteFriend = async (friendId) => {
    setIsLoading({
      ...isLoading,
      [friendId]: false,
    });

    const result = await deleteFriend(
      t,
      i18n.language,
      user,
      friendId,
      axiosJWT,
      accessToken,
      toastTheme,
    );

    if (result.success) {
      setFriendDeleted([...friendDeleted, friendId]);
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
                  i18n.language,
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
                i18n.language,
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
                  {t('message:friends.no_request')}
                </TypographyCenter>
              ) : (
                <TypographyCenter variant="caption">
                  {t('message:seen_all')}
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
                              {t('friends:unfriend')}
                            </LoadingButton>
                            <ConfirmDialog
                              open={openModalConfirm}
                              handleClose={() => setOpenModalConfirm(false)}
                              title={t('user:confirm_unfriend')}
                              handleConfirm={() =>
                                handleDeleteFriend(friend._id)
                              }
                              description={t(
                                'user:confirm_unfriend_description',
                              )}
                              titleCancel={t('user:cancel')}
                              titleConfirm={t('user:confirm')}
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
                            {t('user:accept')}
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
                            <Typography
                              variant="caption"
                              fontSize={10}
                              display={{
                                xs: 'none',
                                sm: 'block',
                              }}
                            >
                              {t('user:joined')}{' '}
                              {moment(friend.createdAt).fromNow()}
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
