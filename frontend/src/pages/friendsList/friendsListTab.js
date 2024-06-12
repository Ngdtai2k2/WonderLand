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

import PersonRemoveRoundedIcon from '@mui/icons-material/PersonRemoveRounded';

import LoadingCircularIndeterminate from '../../components/Loading';
import ConfirmDialog from '../../components/Dialog';

import { API } from '../../api';
import {
  deleteFriend,
  getFriendsList,
  refreshFriendList,
} from '../../utils/friendServices';
import { useToastTheme } from '../../constants/constant';
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

  const page = useRef(1);
  const navigate = useNavigate();
  const toastTheme = useToastTheme();
  const { t, i18n } = useTranslation(['friends', 'message', 'user']);
  const { user, accessToken, axiosJWT } = useUserAxios(i18n.language);

  useEffect(() => {
    document.title = t('friends:friends_list');
  }, [t]);

  const url = API.FRIEND.BASE;

  useEffect(() => {
    if (user) {
      getFriendsList(
        i18n.language,
        url,
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
      toast.warning(t('message:need_login'), toastTheme);
      navigate('/');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDeleteFriend = async (friendId) => {
    setIsLoadingDelete((prevState) => ({
      ...prevState,
      [friendId]: true,
    }));
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
                    i18n.language,
                    url,
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
                  i18n.language,
                  url,
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
                    {t('message:friends.any_friend')}
                  </TypographyCenter>
                ) : (
                  <TypographyCenter variant="caption">
                    {t('message:friends.make_friend')}
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
                            {t('friends:unfriend')}
                          </LoadingButton>
                        }
                        disablePadding
                        sx={{ marginY: 1, paddingX: 1 }}
                      >
                        <ConfirmDialog
                          open={openModalConfirm}
                          handleClose={() => setOpenModalConfirm(false)}
                          title={t('user:confirm_unfriend')}
                          handleConfirm={() => handleDeleteFriend(friend._id)}
                          description={t('user:confirm_unfriend_description')}
                          titleCancel={t('user:cancel')}
                          titleConfirm={t('user:confirm')}
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
                              {friend.about.length > 15
                                ? friend.about.slice(0, 15) + '...'
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
