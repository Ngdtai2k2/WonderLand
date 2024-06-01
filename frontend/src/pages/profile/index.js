import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import moment from 'moment';

import { useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';

import Avatar from '@mui/material/Avatar';
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
import { ButtonStyled } from './styles';
import {
  acceptRequestAddFriend,
  cancelRequestAddFriend,
  deleteFriend,
  sendRequestAddFriend,
} from '../../utils/friendServices';

export default function Profile() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tabIndex, setTabIndex] = useState(0);
  const [hasSendRequestAddFriend, setHasSendRequestAddFriend] = useState(false);
  const [isFriend, setIsFriend] = useState(false);
  const [friendRequest, setFriendRequest] = useState();
  const [openModalConfirm, setOpenModalConfirm] = useState(false);

  const { t, i18n } = useTranslation(['user', 'message']);
  const theme = useTheme();
  const toastTheme = useToastTheme();
  const isSmOrBelow = useMediaQuery(theme.breakpoints.down('sm'));
  const { user, accessToken, axiosJWT } = useUserAxios(i18n.language);

  const handleChangeTab = (event, newValue) => {
    setTabIndex(newValue);
  };

  useEffect(() => {
    const getUserProfile = async () => {
      try {
        setLoading(true);
        const url = user
          ? `${BaseApi}/user/${id}?request_user=${user?._id}`
          : `${BaseApi}/user/${id}`;

        const response = await axios.get(url);
        setData(response?.data?.user);
        setHasSendRequestAddFriend(response?.data?.hasSendRequestAddFriend);
        setIsFriend(response?.data?.isFriend);
        setFriendRequest(response?.data?.friendRequest);
      } catch (error) {
        if (error.response && error.response.status === 404) {
          setData(null);
          toast.error('Cannot find data!', toastTheme);
        }
      } finally {
        setLoading(false);
      }
    };

    getUserProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    document.title = data ? `${data?.fullname}'s profile` : 'Loading...';
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
        }}
      >
        <Box display="flex" alignItems="center" marginY={1}>
          <Avatar
            src={data?.media?.url}
            alt={'Avatar of' + data?.fullname}
            sx={{ width: 60, height: 60 }}
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
            <Typography variant="caption">
              {t('user:joined')} {moment(data?.createdAt).fromNow()}
            </Typography>
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
