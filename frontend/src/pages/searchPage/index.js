import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import Link from '@mui/material/Link';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';

import PostCard from '../../components/PostCard';
import CustomBox from '../../components/CustomBox';
import LoadingCircularIndeterminate from '../../components/Loading';

import search from '../../utils/searchServices';
import useUserAxios from '../../hooks/useUserAxios';

export default function SearchPage() {
  const [dataSearch, setDataSearch] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasLoadMoreUser, setHasLoadMoreUser] = useState(true);
  const [hasLoadMorePost, setHasLoadMorePost] = useState(true);

  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const query = urlParams.get('query');

  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const { user } = useUserAxios(i18n.language);

  useEffect(() => {
    if (!isLoading) {
      document.title = `Search for ${query}`;
    }
  }, [query, isLoading]);

  useEffect(() => {
    search(
      i18n.language,
      user?._id,
      query,
      dataSearch,
      setDataSearch,
      setIsLoading,
      setHasLoadMoreUser,
      setHasLoadMorePost,
      currentPage,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, currentPage]);

  const loadMore = () => {
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
  };

  return isLoading ? (
    <>
      <LoadingCircularIndeterminate />
    </>
  ) : (
    <CustomBox>
      {dataSearch.users?.data && dataSearch.users?.data.length > 0 && (
        <>
          <Typography variant="h6" marginLeft={2} sx={{ cursor: 'pointer' }}>
            Users:
          </Typography>
          {dataSearch.users?.data.map((user) => (
            <MenuItem
              key={user._id}
              onClick={() => {
                navigate(`/u/${user._id}`);
              }}
            >
              <Box gap={1} display="flex">
                <Avatar src={user?.media?.url} />
                <Typography variant="body1">{user.fullname}</Typography>
                <Typography variant="caption">{user.nickname}</Typography>
              </Box>
            </MenuItem>
          ))}
        </>
      )}
      {dataSearch.posts?.data && dataSearch.posts?.data.length > 0 && (
        <>
          <Typography variant="h6" marginLeft={2} sx={{ cursor: 'pointer' }}>
            Posts:
          </Typography>
          <Box
            display="flex"
            justifyContent="center"
            flexDirection="column"
            alignItems="center"
            gap={2}
            margin={{
              xs: 1.5,
              md: 3,
            }}
          >
            {dataSearch.posts?.data.map((post) => (
              <PostCard
                key={post?._id}
                post={post}
                detail={false}
                xs="100%"
                sm="70%"
                md="50%"
              />
            ))}
          </Box>
        </>
      )}
      {(hasLoadMoreUser || hasLoadMorePost) && (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          marginTop={1}
        >
          <Link onClick={() => loadMore()} sx={{ cursor: 'pointer' }}>
            Load More
          </Link>
        </Box>
      )}
    </CustomBox>
  );
}
