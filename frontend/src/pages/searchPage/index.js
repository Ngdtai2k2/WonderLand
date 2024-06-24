/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';

import BallotRoundedIcon from '@mui/icons-material/BallotRounded';
import ArtTrackRoundedIcon from '@mui/icons-material/ArtTrackRounded';
import PeopleAltRoundedIcon from '@mui/icons-material/PeopleAltRounded';

import { grey } from '@mui/material/colors';

import PostCard from '../../components/PostCard';
import CustomBox from '../../components/CustomBox';
import LoadingCircularIndeterminate from '../../components/Loading';

import { searchPosts, searchUsers } from '../../api/search';
import useUserAxios from '../../hooks/useUserAxios';
import {
  BoxButton,
  ButtonFilter,
  ListButton,
  ListContainerResult,
  ListItemIconStyle,
  ListStyle,
  PaperStyle,
} from './styles';
import ListItemUser from '../../components/ListItemUser';
import PeopleTab from './peopleTab';
import PostTab from './postTab';

export default function SearchPage() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [posts, setPosts] = useState([]);
  const [isLoadingPosts, setIsLoadingPosts] = useState(false);
  const [hasMorePosts, setHasMorePosts] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);

  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const query = urlParams.get('query');
  const tab = Number(urlParams.get('tab_index'));
  const tabArr = [0, 1, 2];

  const navigate = useNavigate();
  const { t, i18n } = useTranslation(['search']);
  const { user } = useUserAxios(i18n.language);

  useEffect(() => {
    document.title =
      isLoading && isLoadingPosts
        ? 'Loading...'
        : `${t('search:title')} - ${query}`;
  }, [query, isLoading, isLoadingPosts, t]);

  useEffect(() => {
    if (tabArr.includes(tab)) {
      setTabIndex(tab);
    } else {
      setTabIndex(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, tabIndex]);

  useEffect(() => {
    searchUsers(
      i18n.language,
      user?._id,
      query,
      users,
      setUsers,
      setIsLoading,
      false,
      setHasMore,
    );

    searchPosts(
      i18n.language,
      user?._id,
      query,
      posts,
      setPosts,
      setIsLoadingPosts,
      setHasMorePosts,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  const handleChangeTab = (index) => {
    urlParams.set('tab_index', index);
    navigate(`?${urlParams.toString()}`, {
      replace: true,
    });
  };

  return isLoading ? (
    <>
      <LoadingCircularIndeterminate />
    </>
  ) : (
    <CustomBox sx={{ margin: '75px 10px 0px' }}>
      <Grid container spacing={1}>
        <Grid item xs={12} sm={4}>
          <PaperStyle elevation={1}>
            <Box>
              <Typography variant="h5" fontWeight={700}>
                {t('search:title')}
              </Typography>
              <Typography variant="body1" marginTop={1} color={grey[400]}>
                {query}
              </Typography>
            </Box>
            <Divider sx={{ marginTop: 2 }} />
            <BoxButton>
              <ButtonFilter
                disabled={tabIndex === 0}
                onClick={() => handleChangeTab(0)}
              >
                <BallotRoundedIcon />
                {t('search:all')}
              </ButtonFilter>
              <ButtonFilter
                disabled={tabIndex === 1}
                onClick={() => handleChangeTab(1)}
              >
                <PeopleAltRoundedIcon />
                {t('search:people')}
              </ButtonFilter>
              <ButtonFilter
                disabled={tabIndex === 2}
                onClick={() => handleChangeTab(2)}
              >
                <ArtTrackRoundedIcon />
                {t('search:post')}
              </ButtonFilter>
            </BoxButton>
            <ListStyle>
              <ListButton
                disabled={tabIndex === 0}
                onClick={() => handleChangeTab(0)}
              >
                <ListItemIconStyle>
                  <BallotRoundedIcon />
                </ListItemIconStyle>
                <ListItemText primary={t('search:all')} />
              </ListButton>
              <ListButton
                disabled={tabIndex === 1}
                onClick={() => handleChangeTab(1)}
              >
                <ListItemIconStyle>
                  <PeopleAltRoundedIcon />
                </ListItemIconStyle>
                <ListItemText primary={t('search:people')} />
              </ListButton>
              <ListButton
                disabled={tabIndex === 2}
                onClick={() => handleChangeTab(2)}
              >
                <ListItemIconStyle>
                  <ArtTrackRoundedIcon />
                </ListItemIconStyle>
                <ListItemText primary={t('search:post')} />
              </ListButton>
            </ListStyle>
          </PaperStyle>
        </Grid>
        <Grid item xs={12} sm={8}>
          <PaperStyle
            elevation={1}
            sx={{
              overflowY: 'auto',
            }}
          >
            {tabIndex === 0 && (
              <>
                {/* people */}
                <Typography variant="h6" fontWeight={600}>
                  {t('search:people')}
                </Typography>
                <ListContainerResult>
                  {users?.users?.data?.length > 0 &&
                    users.users.data
                      .slice(0, 5)
                      .map((item) => (
                        <ListItemUser
                          key={item?._id}
                          _id={item?._id}
                          nickname={item?.nickname}
                          avatar={item?.media?.url}
                          isFriend={item?.isFriend}
                          totalFriend={item?.totalFriend}
                        />
                      ))}
                  {hasMore && (
                    <Box
                      display="flex"
                      justifyContent="center"
                      marginBottom={0.5}
                    >
                      <Button
                        variant="outlined"
                        size="small"
                        sx={{ textTransform: 'none' }}
                      >
                        {t('search:view_all')}
                      </Button>
                    </Box>
                  )}
                </ListContainerResult>
                <Divider sx={{ marginY: 1 }} />
                {/* post */}
                <Typography variant="h6" fontWeight={600}>
                  {t('search:post')}
                </Typography>
                <ListContainerResult
                  sx={{
                    display: 'flex',
                    gap: 1,
                    flexDirection: 'column',
                    alignItems: 'center',
                  }}
                >
                  {posts?.posts?.data?.length > 0 &&
                    posts.posts.data
                      .slice(0, 5)
                      .map((post) => (
                        <PostCard
                          key={post._id}
                          post={post}
                          xs="100%"
                          sm="80%"
                          md="70%"
                        />
                      ))}
                  {hasMorePosts && (
                    <Box
                      display="flex"
                      justifyContent="center"
                      marginBottom={0.5}
                    >
                      <Button
                        variant="outlined"
                        size="small"
                        sx={{ textTransform: 'none' }}
                      >
                        {t('search:view_all')}
                      </Button>
                    </Box>
                  )}
                </ListContainerResult>
              </>
            )}
            {tabIndex === 1 && <PeopleTab query={query} />}
            {tabIndex === 2 && <PostTab query={query} />}
          </PaperStyle>
        </Grid>
      </Grid>
    </CustomBox>
  );
}
