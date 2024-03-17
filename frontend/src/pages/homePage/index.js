import React, { useEffect, useState } from "react";
import ButtonBar from "../../components/ButtonBar";
import axios from "axios";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import SentimentVeryDissatisfiedRoundedIcon from "@mui/icons-material/SentimentVeryDissatisfiedRounded";

import { BaseApi } from "../../constants/constant";
import InfiniteScroll from "react-infinite-scroll-component";
import PostCard from "../../components/PostCard";

let page = 1;
const fetchData = (setItems, items, setHasMore) => {
  axios.get(`${BaseApi}/post?_page=${page}&_limit=10`).then((res) => {
    if (res.data.result.docs.length === 0) {
      setItems([...items]);
      setHasMore(false);
    } else {
      setItems([...items, ...res.data.result.docs]);
      setHasMore(true);
      page = page + 1;
    }
  });
};

const refresh = (setItems, setHasMore) => {
  page = 1;
  fetchData(setItems, [], setHasMore);
};

export default function HomePage() {
  const [data, setData] = useState([]);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchData(setData, data, setHasMore);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <ButtonBar />
      <InfiniteScroll
        dataLength={data.length}
        next={() => {
          fetchData(setData, data, setHasMore);
        }}
        hasMore={hasMore}
        loader={<h4>Loading...</h4>}
        refreshFunction={() => refresh(setData, setHasMore)}
        pullDownToRefresh
      >
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
              key={post._id}
              avatar={post.author.media.url}
              fullname={post.author.fullname}
              title={post.title}
              content={post.content}
              media={post.media}
              createdAt={post.createdAt}
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
      </InfiniteScroll>
    </>
  );
}
