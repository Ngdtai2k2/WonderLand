import React, { useEffect, useRef, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import SentimentVeryDissatisfiedRoundedIcon from '@mui/icons-material/SentimentVeryDissatisfiedRounded';

import PostCard from '../PostCard';
import LoadingCircularIndeterminate from '../Loading';
import { getPosts, refresh } from '../../utils/postServices';
import useUserAxios from '../../hooks/useUserAxios';

export default function RenderPost({ apiLink, type }) {
  const [data, setData] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [isRefresh, setIsRefresh] = useState();

  const page = useRef(1);
  const { user } = useUserAxios();

  useEffect(() => {
    getPosts(apiLink, setData, data, setHasMore, page, user?._id, type);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isRefresh !== undefined) {
      refresh(apiLink, setData, setHasMore, page, user?._id, type);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRefresh]);

  return (
    <>
      <Box
        display="flex"
        justifyContent="center"
        flexDirection="column"
        alignItems="center"
        gap={2}
        marginX={{
          xs: 1.5,
          md: 3,
        }}
      >
        {data?.map((post) => (
          <PostCard
            key={post?._id}
            post={post}
            detail={false}
            xs="100%"
            setState={setIsRefresh}
          />
        ))}
        {!hasMore && (
          <Typography
            variant="body1"
            textAlign="center"
            display="flex"
            alignItems="center"
            flexDirection="column"
          >
            <SentimentVeryDissatisfiedRoundedIcon />
            No more posts!
          </Typography>
        )}
      </Box>
      <InfiniteScroll
        dataLength={data.length}
        next={() => {
          if (hasMore) {
            getPosts(apiLink, setData, data, setHasMore, page, user?._id, type);
          }
        }}
        hasMore={hasMore}
        loader={<LoadingCircularIndeterminate />}
        refreshFunction={() =>
          refresh(apiLink, setData, setHasMore, page, user?._id, type)
        }
        pullDownToRefresh
      ></InfiniteScroll>
    </>
  );
}
