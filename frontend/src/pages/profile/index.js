import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import axios from 'axios';

import { useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import TabContext from '@mui/lab/TabContext';
import Divider from '@mui/material/Divider';

import AddReactionRoundedIcon from '@mui/icons-material/AddReactionRounded';
import PostAddRoundedIcon from '@mui/icons-material/PostAddRounded';
import CommentRoundedIcon from '@mui/icons-material/CommentRounded';
import StarsRoundedIcon from '@mui/icons-material/StarsRounded';
import PersonAddAlt1RoundedIcon from '@mui/icons-material/PersonAddAlt1Rounded';
import PersonRemoveRoundedIcon from '@mui/icons-material/PersonRemoveRounded';
import GroupRoundedIcon from '@mui/icons-material/GroupRounded';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import Diversity1Icon from '@mui/icons-material/Diversity1';
import AddAPhotoRoundedIcon from '@mui/icons-material/AddAPhotoRounded';

import CustomBox from '../../components/CustomBox';
import NotFound from '../../components/NotFound';
import LoadingCircularIndeterminate from '../../components/Loading';
import ConfirmDialog from '../../components/Dialog';

import PostTab from './postTab';
import ReactionTab from './reactionTab';
import SavedPostTab from './savedPostTab';

import { BaseApi, useToastTheme } from '../../constants/constant';
import useUserAxios from '../../hooks/useUserAxios';
import { ButtonTab, TypographyButtonTab } from '../styles';
import {
  AvatarProfile,
  ButtonChangeAvatar,
  ButtonChangeCoverPhoto,
  ButtonStyled,
  CoverArt,
} from './styles';
import {
  acceptRequestAddFriend,
  cancelRequestAddFriend,
  deleteFriend,
  sendRequestAddFriend,
} from '../../utils/friendServices';
import ModalUpdateMedia from './modalUpdateMedia';

export default function Profile() {
  const { id } = useParams();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tabIndex, setTabIndex] = useState(0);
  const [hasSendRequestAddFriend, setHasSendRequestAddFriend] = useState(false);
  const [isFriend, setIsFriend] = useState(false);
  const [friendRequest, setFriendRequest] = useState();
  const [openModalConfirm, setOpenModalConfirm] = useState(false);
  const [openModalChangeAvatar, setOpenModalChangeAvatar] = useState(false);
  const [isUpdateAvatar, setIsUpdateAvatar] = useState(0);
  const [event, setEvent] = useState();

  const { t, i18n } = useTranslation(['user', 'message']);
  const theme = useTheme();
  const toastTheme = useToastTheme();
  const isSmOrBelow = useMediaQuery(theme.breakpoints.down('sm'));

  const { user, accessToken, axiosJWT } = useUserAxios(i18n.language);

  const handleChangeTab = (event, newValue) => {
    setTabIndex(newValue);
  };

  const getUserProfile = async () => {
    try {
      setLoading(true);
      const url = user
        ? `${BaseApi}/user/${id}?request_user=${user?._id}`
        : `${BaseApi}/user/${id}`;

      const response = await axios.get(url, {
        headers: {
          'Accept-Language': i18n.language,
        },
      });
      setData(response?.data?.user);
      setHasSendRequestAddFriend(response?.data?.hasSendRequestAddFriend);
      setIsFriend(response?.data?.isFriend);
      setFriendRequest(response?.data?.friendRequest);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setData(null);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUserProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, event]);

  useEffect(() => {
    document.title = data ? `${data?.fullname}` : 'Loading...';
  }, [data?.fullname, data]);

  if (!data && !loading) {
    return <NotFound />;
  }

  const handleSendRequestAddFriend = async () => {
    const result = await sendRequestAddFriend(
      t,
      i18n.language,
      user,
      data?._id,
      axiosJWT,
      accessToken,
      toastTheme,
    );
    if (result.success) {
      setHasSendRequestAddFriend(true);
    }
  };

  const handleCancelRequestAddFriend = async () => {
    const result = await cancelRequestAddFriend(
      t,
      i18n.language,
      user,
      data?._id,
      axiosJWT,
      accessToken,
      toastTheme,
    );
    if (result.success) {
      setHasSendRequestAddFriend(false);
    }
  };

  const handleAcceptRequestAddFriend = async () => {
    const result = await acceptRequestAddFriend(
      t,
      i18n.language,
      user,
      data?._id,
      axiosJWT,
      accessToken,
      toastTheme,
    );
    if (result.success) {
      setIsFriend(true);
    }
  };

  const handleDeleteFriend = async () => {
    const result = await deleteFriend(
      t,
      i18n.language,
      user,
      data?._id,
      axiosJWT,
      accessToken,
      toastTheme,
    );
    if (result.success) {
      setIsFriend(false);
      setHasSendRequestAddFriend(false);
      setFriendRequest(null);
    }
  };

  const handleOpenModalEditMedia = (type) => {
    setOpenModalChangeAvatar(true);
    setIsUpdateAvatar(type);
  };

  return loading ? (
    <LoadingCircularIndeterminate />
  ) : (
    <CustomBox>
      <Paper
        variant="outlined"
        sx={{
          p: {
            xs: 1,
            md: 2,
          },
          width: '100%',
        }}
      >
        <Box position="relative">
          <CoverArt
            src={data?.coverArt?.url}
            alt={'Cover art of ' + data?.fullname}
            variant="square"
          />
          {user?._id === data?._id && (
            <ButtonChangeCoverPhoto
              variant="contained"
              onClick={() => handleOpenModalEditMedia(1)}
            >
              <AddAPhotoRoundedIcon /> {t('user:update_cover_photo')}
            </ButtonChangeCoverPhoto>
          )}
        </Box>
        <Box display="flex" alignItems="center" marginBottom={1} width="100%">
          <Box position="relative">
            <AvatarProfile
              src={data?.media?.url}
              alt={'Avatar of ' + data?.fullname}
              sx={{
                borderColor:
                  theme.palette.mode === 'light' ? '#ffffff' : '#121212',
              }}
            />
            {user?._id === data?._id && (
              <ButtonChangeAvatar
                size="small"
                sx={{
                  backgroundColor:
                    theme.palette.mode === 'light' ? '#e4e6eb' : '#212121',
                  '&:hover': {
                    backgroundColor: '#212121',
                    color: '#fff',
                  },
                }}
                onClick={() => handleOpenModalEditMedia(0)}
              >
                <AddAPhotoRoundedIcon />
              </ButtonChangeAvatar>
            )}
          </Box>
          <ModalUpdateMedia
            open={openModalChangeAvatar}
            handleClose={() => setOpenModalChangeAvatar(false)}
            type={isUpdateAvatar}
            setEvent={setEvent}
          />
          <Box marginLeft={1}>
            <Typography
              variant="h6"
              fontWeight={600}
              display="flex"
              alignItems="flex-start"
            >
              {data?.fullname}
            </Typography>
            <Typography variant="caption">@{data?.nickname}</Typography>
          </Box>
        </Box>
        <Typography variant="h6">{data?.about}</Typography>
        <Box
          marginY={2}
          display="flex"
          justifyContent={{
            xs: 'center',
            md: 'flex-end',
          }}
          gap={1}
        >
          {user?._id !== data?._id && (
            <>
              {isFriend ? (
                <>
                  <ButtonStyled
                    variant="outlined"
                    size="small"
                    color="success"
                    onClick={() => setOpenModalConfirm(true)}
                  >
                    <Diversity1Icon fontSize="small" /> {t('user:friend')}
                  </ButtonStyled>
                  <ConfirmDialog
                    open={openModalConfirm}
                    handleClose={() => setOpenModalConfirm(false)}
                    title={t('user:confirm_unfriend')}
                    handleConfirm={() => handleDeleteFriend()}
                    description={t('user:confirm_unfriend_description')}
                    titleCancel={t('user:cancel')}
                    titleConfirm={t('user:confirm')}
                  />
                </>
              ) : friendRequest && friendRequest.friend === user?._id ? (
                /* handle modal confirm later  */
                <ButtonStyled
                  variant="outlined"
                  size="small"
                  color="success"
                  onClick={handleAcceptRequestAddFriend}
                >
                  <PersonAddAlt1RoundedIcon fontSize="small" />{' '}
                  {t('user:accept')}
                </ButtonStyled>
              ) : hasSendRequestAddFriend ? (
                <ButtonStyled
                  variant="outlined"
                  size="small"
                  color="error"
                  onClick={handleCancelRequestAddFriend}
                >
                  <PersonRemoveRoundedIcon fontSize="small" />{' '}
                  {t('user:cancel_request')}
                </ButtonStyled>
              ) : (
                <ButtonStyled
                  variant="outlined"
                  size="small"
                  color="primary"
                  onClick={handleSendRequestAddFriend}
                >
                  <PersonAddAlt1RoundedIcon fontSize="small" />{' '}
                  {t('user:add_friend')}
                </ButtonStyled>
              )}

              <ButtonStyled variant="outlined" size="small" color="info">
                <SendRoundedIcon fontSize="small" /> {t('user:send_message')}
              </ButtonStyled>
            </>
          )}

          {user?._id === data?._id && (
            <ButtonStyled variant="outlined" size="small" href="/friends">
              <GroupRoundedIcon /> {t('user:friends_list')}
            </ButtonStyled>
          )}
        </Box>
        <Divider sx={{ marginY: 2 }} />
        <TabContext value={tabIndex}>
          <Box
            sx={{ marginY: 2, ...(isSmOrBelow ? null : { display: 'flex' }) }}
          >
            <Tabs
              value={tabIndex}
              onChange={handleChangeTab}
              variant={isSmOrBelow ? 'scrollable' : 'standard'}
              orientation={isSmOrBelow ? 'horizontal' : 'vertical'}
              sx={{ display: 'flex', alignItems: 'center' }}
            >
              <ButtonTab
                label={
                  <TypographyButtonTab gap={1}>
                    <AddReactionRoundedIcon />
                    {t('user:reaction')}
                  </TypographyButtonTab>
                }
              />
              <ButtonTab
                label={
                  <TypographyButtonTab gap={1}>
                    <PostAddRoundedIcon />
                    {t('user:post')}
                  </TypographyButtonTab>
                }
              />
              <ButtonTab
                label={
                  <TypographyButtonTab gap={1}>
                    <CommentRoundedIcon />
                    {t('user:comment')}
                  </TypographyButtonTab>
                }
              />
              <ButtonTab
                label={
                  <TypographyButtonTab gap={1}>
                    <StarsRoundedIcon />
                    {t('user:save_post')}
                  </TypographyButtonTab>
                }
              />
            </Tabs>
            <Box
              sx={{
                ...(isSmOrBelow
                  ? { marginTop: 3, width: '100%' }
                  : { marginLeft: 3, width: '65%' }),
              }}
            >
              {tabIndex === 0 && <ReactionTab />}
              {tabIndex === 1 && <PostTab />}
              {tabIndex === 2 && <div>Tab3</div>}
              {tabIndex === 3 && <SavedPostTab />}
            </Box>
          </Box>
        </TabContext>
      </Paper>
    </CustomBox>
  );
}
