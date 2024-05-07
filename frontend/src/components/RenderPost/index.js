import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import InfiniteScroll from 'react-infinite-scroll-component';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import SentimentVeryDissatisfiedRoundedIcon from '@mui/icons-material/SentimentVeryDissatisfiedRounded';

import ButtonBar from '../ButtonBar';
import PostCard from '../PostCard';
import LoadingCircularIndeterminate from '../Loading';
import { fetchData, refresh } from '../../utils/postServices';

export default function RenderPost({ apiLink, type, isHiddenButtonBar }) {
  const [data, setData] = useState([]);
  const [hasMore, setHasMore] = useState(true);

  const page = useRef(1);
  const user = useSelector((state) => state.auth.login?.currentUser);

  useEffect(() => {
    fetchData(apiLink, setData, data, setHasMore, page, user?._id, type);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {!isHiddenButtonBar && <ButtonBar />}
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
        {data?.map((post) => (
          <PostCard
            key={post?._id}
            post={post}
            detail={false}
            xs="100%"
            sm="70%"
            md="50%"
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
            fetchData(
              apiLink,
              setData,
              data,
              setHasMore,
              page,
              user?._id,
              type,
            );
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
