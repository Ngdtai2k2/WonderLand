import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import Zoom from 'react-medium-image-zoom';
import { useTheme } from '@emotion/react';
import { toast } from 'react-toastify';
import axios from 'axios';

import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import TabContext from '@mui/lab/TabContext';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded';
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import WhatshotRoundedIcon from '@mui/icons-material/WhatshotRounded';
import QueryBuilderRoundedIcon from '@mui/icons-material/QueryBuilderRounded';
import InfoRoundedIcon from '@mui/icons-material/InfoRounded';
// eslint-disable-next-line no-unused-vars
import NotificationsActiveRoundedIcon from '@mui/icons-material/NotificationsActiveRounded';
import NotificationsOffRoundedIcon from '@mui/icons-material/NotificationsOffRounded';

import CustomBox from '../../components/CustomBox';
import NotFound from '../../components/NotFound';
import RenderPost from '../../components/RenderPost';
import LoadingCircularIndeterminate from '../../components/Loading';
import ReadMore from '../../components/Readmore';

import { API } from '../../api/base';
import { convertNumber } from '../../utils/helperFunction';
import useUserAxios from '../../hooks/useUserAxios';
import {
  createElementStyleForZoom,
  useToastTheme,
} from '../../constants/constant';

import { AvatarCategory } from './styles';

export default function CategoryDetail() {
  const [category, setCategory] = useState();
  const [totalLike, setTotalLike] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);
  const [hasFollowed, setHasFollowed] = useState(false);
  const [isNotification, setIsNotification] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);

  const { categoryId } = useParams();
  const theme = useTheme();
  const toastTheme = useToastTheme();
  const { t, i18n } = useTranslation(['message', 'category']);
  const { user, accessToken, axiosJWT } = useUserAxios(i18n.language);

  useEffect(() => {
    document.title = category ? category.name : 'Category not found!';
  }, [category]);

  useEffect(() => {
    createElementStyleForZoom(theme);
  }, [theme, theme.palette.mode]);

  useEffect(() => {
    const getCategoryDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.post(
          API.CATEGORY.DETAIL(categoryId),
          {
            request_user: user?._id,
          },
          {
            headers: {
              'Accept-Language': i18n.language,
            },
          },
        );
        setCategory(response.data.category);
        setTotalLike(response.data.category.like.length);
        setHasLiked(response.data.hasLiked);
        setHasFollowed(response.data.hasFollowed);
        setIsNotification(response.data.isNotification);
      } catch (error) {
        setCategory(null);
      } finally {
        setLoading(false);
      }
    };
    getCategoryDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryId]);

  const handleChangeTab = (event, newValue) => {
    setTabIndex(newValue);
  };

  const handleLikeCategory = async (categoryId) => {
    try {
      if (!user) {
        return toast.warning(t('message:need_login'), toastTheme);
      }
      const response = await axiosJWT.post(
        API.CATEGORY.LIKE(categoryId),
        {
          userId: user._id,
        },
        {
          headers: {
            token: `Bearer ${accessToken}`,
            'Accept-Language': i18n.language,
          },
        },
      );
      const resData = response.data;
      setTotalLike(resData.isUnliked ? totalLike - 1 : totalLike + 1);
      setHasLiked(!resData.isUnliked);
      toast.success(resData.message, toastTheme);
    } catch (error) {
      toast.error(error.response.data.message, toastTheme);
    }
  };

  const handleFollowCategory = async (categoryId) => {
    try {
      if (!user) {
        return toast.warning(t('message:need_login'), toastTheme);
      }
      const response = await axiosJWT.post(
        API.CATEGORY.FOLLOW(categoryId),
        {
          userId: user._id,
        },
        {
          headers: {
            token: `Bearer ${accessToken}`,
            'Accept-Language': i18n.language,
          },
        },
      );
      const resData = response.data;
      setHasFollowed(!resData.isUnfollowed);
      toast.success(resData.message, toastTheme);
    } catch (error) {
      toast.error(error.response.data.message, toastTheme);
    }
  };

  const changeIsNotificationAfterFollowCategory = async (
    categoryId,
    userId,
    isNotification,
  ) => {
    try {
      if (!user) {
        return toast.warning(t('message:need_login'), toastTheme);
      }
      const response = await axiosJWT.put(
        API.CATEGORY.NOTIFICATION(categoryId, userId),
        {
          isNotification: isNotification,
        },
        {
          headers: {
            token: `Bearer ${accessToken}`,
            'Accept-Language': i18n.language,
          },
        },
      );
      setIsNotification(response.data.isNotification);
      toast.success(response.data.message);
    } catch (error) {
      toast.error(error.response.data.message, toastTheme);
    }
  };

  return loading ? (
    <LoadingCircularIndeterminate />
  ) : category ? (
    <CustomBox>
      <Paper
        sx={{
          p: {
            xs: 2,
            md: 4,
          },
        }}
      >
        <Grid container spacing={2} marginBottom={2}>
          <Grid item xs={12} sm={4} md={3}>
            <Zoom>
              <AvatarCategory
                src={category?.media?.url}
                variant="rounded"
                alt={category?.name}
              />
            </Zoom>
          </Grid>
          <Grid
            item
            xs={12}
            sm={8}
            md={9}
            display="flex"
            flexDirection="column"
            justifyContent="space-between"
          >
            <Box>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography variant="h4" fontWeight={700}>
                  {category?.name}
                </Typography>
                <Box display="flex" alignItems="center" gap={0.5}>
                  <Button
                    variant="outlined"
                    sx={{ height: 30, textTransform: 'none' }}
                    onClick={() => handleFollowCategory(category._id)}
                  >
                    {hasFollowed
                      ? t('category:unfollow')
                      : t('category:follow')}
                  </Button>
                  {hasFollowed && (
                    <IconButton
                      size="small"
                      onClick={() =>
                        changeIsNotificationAfterFollowCategory(
                          category._id,
                          user?._id,
                          !isNotification,
                        )
                      }
                    >
                      {isNotification ? (
                        <NotificationsActiveRoundedIcon />
                      ) : (
                        <NotificationsOffRoundedIcon />
                      )}
                    </IconButton>
                  )}
                </Box>
              </Box>
              <ReadMore
                maxLength={100}
                typographyProps={{
                  component: 'span',
                  variant: 'body1',
                }}
              >
                {category?.description}
              </ReadMore>
            </Box>
            <Box display="flex" justifyContent="flex-end" alignItems="center">
              <Box display="flex" justifyContent="center" alignItems="center">
                <IconButton
                  aria-label="like category"
                  onClick={() => handleLikeCategory(category._id)}
                >
                  {hasLiked ? (
                    <FavoriteRoundedIcon color="error" />
                  ) : (
                    <FavoriteBorderRoundedIcon color="error" />
                  )}
                </IconButton>
                <Typography
                  variant="body1"
                  paddingX={0.5}
                  color={hasLiked ? 'error' : ''}
                >
                  {convertNumber(totalLike)}
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
        <TabContext value={tabIndex}>
          <Tabs value={tabIndex} onChange={handleChangeTab} centered>
            <Tab
              label={
                <Typography
                  variant="body1"
                  display="flex"
                  alignItems="center"
                  gap={0.5}
                >
                  <WhatshotRoundedIcon fontSize="16" />
                  {t('category:hot')}
                </Typography>
              }
            />
            <Tab
              label={
                <Typography
                  variant="body1"
                  display="flex"
                  alignItems="center"
                  gap={0.5}
                >
                  <QueryBuilderRoundedIcon fontSize="16" />
                  {t('category:fresh')}
                </Typography>
              }
            />
            <Tab
              label={
                <Typography
                  variant="body1"
                  display="flex"
                  alignItems="center"
                  gap={0.5}
                >
                  <InfoRoundedIcon fontSize="16" />
                  {t('category:description')}
                </Typography>
              }
            />
          </Tabs>
        </TabContext>
      </Paper>
      <Box display="flex" justifyContent="center">
        {tabIndex === 0 && (
          <Box
            marginTop={1}
            width={{
              xs: '100%',
              sm: '80%',
              md: '50%',
            }}
          >
            <RenderPost
              apiLink={API.POST.GET_BY_CATEGORY(
                categoryId,
                false,
                'desc',
                'createdAt',
              )}
            />
          </Box>
        )}
        {tabIndex === 1 && (
          <Box
            marginTop={1}
            width={{
              xs: '100%',
              sm: '80%',
              md: '50%',
            }}
          >
            <RenderPost
              apiLink={API.POST.GET_BY_CATEGORY(
                categoryId,
                true,
                'desc',
                'createdAt',
              )}
            />
          </Box>
        )}
        {tabIndex === 2 && (
          <Box marginY={2}>
            <Typography>{category?.description}</Typography>
          </Box>
        )}
      </Box>
    </CustomBox>
  ) : (
    <NotFound />
  );
}
