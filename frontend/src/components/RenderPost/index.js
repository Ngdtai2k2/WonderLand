import React, { useEffect, useRef, useState } from 'react';
import ButtonBar from '../ButtonBar';
import InfiniteScroll from 'react-infinite-scroll-component';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import SentimentVeryDissatisfiedRoundedIcon from '@mui/icons-material/SentimentVeryDissatisfiedRounded';

import PostCard from '../PostCard';
import LoadingCircularIndeterminate from '../Loading';
import { fetchData, refresh } from '../../utils/apiGetPost';

export default function RenderPost({ apiLink }) {
  const [data, setData] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const page = useRef(1);

  useEffect(() => {
    fetchData(apiLink, setData, data, setHasMore, page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <ButtonBar />
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
            id={post?._id}
            avatar={post?.author?.media?.url}
            authorId={post?.author?._id}
            fullname={post?.author?.fullname}
            title={post?.title}
            content={post?.content}
            media={post?.media}
            createdAt={post?.createdAt}
            xs="100%"
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
            fetchData(apiLink, setData, data, setHasMore, page);
          }
        }}
        hasMore={hasMore}
        loader={<LoadingCircularIndeterminate />}
        refreshFunction={() => refresh(apiLink, setData, setHasMore, page)}
        pullDownToRefresh
      ></InfiniteScroll>
    </>
  );
}
