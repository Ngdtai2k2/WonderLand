import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

import PostCard from '../../components/PostCard';

import useUserAxios from '../../hooks/useUserAxios';
import { searchPosts } from '../../utils/searchServices';
import { ListContainerResult } from './styles';
import LoadingCircularIndeterminate from '../../components/Loading';

export default function PostTab({ query }) {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const { t, i18n } = useTranslation(['search']);
  const { user } = useUserAxios(i18n.language);

  useEffect(() => {
    searchPosts(
      i18n.language,
      user?._id,
      query,
      posts,
      setPosts,
      setIsLoading,
      setHasMore,
      currentPage,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, user, i18n, currentPage]);

  const loadMore = () => {
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
  };

  return (
    <>
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
        {isLoading ? (
          <LoadingCircularIndeterminate />
        ) : (
          <>
            {posts?.posts?.data?.length > 0 &&
              posts.posts.data.map((post) => (
                <PostCard
                  key={post._id}
                  post={post}
                  xs="100%"
                  sm="80%"
                  md="70%"
                />
              ))}
            {hasMore && (
              <Box display="flex" justifyContent="center" marginBottom={0.5}>
                <Button
                  variant="outlined"
                  size="small"
                  sx={{ textTransform: 'none' }}
                  onClick={loadMore}
                >
                  {t('search:view_all')}
                </Button>
              </Box>
            )}
          </>
        )}
      </ListContainerResult>
    </>
  );
}
