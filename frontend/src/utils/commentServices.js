import axios from 'axios';

import { API } from '../api';

// function support for get comments
const getCommentsByPostId = async (
  lng,
  setIsLoading,
  setItems,
  items,
  setHasMore,
  page,
  postId,
  userId,
) => {
  setIsLoading(true);
  await axios
    .post(
      `${API.COMMENT.GET_BY_POST(postId)}?_page=${page.current}&_limit=10`,
      {
        userId: userId,
      },
      {
        headers: {
          'Accept-Language': lng,
        },
      },
    )
    .then((response) => {
      if (response.data.result.docs.length === 0) {
        setItems([...items]);
        setHasMore(false);
      } else {
        setItems([...items, ...response.data.result.docs]);
        setHasMore(response.data.result.docs.length === 10);
        page.current = page.current + 1;
      }
    });
  setIsLoading(false);
};

// function support for refresh comments
const refresh = (
  lng,
  setIsLoading,
  setItems,
  setHasMore,
  page,
  postId,
  userId,
) => {
  page.current = 1;
  getCommentsByPostId(
    lng,
    setIsLoading,
    setItems,
    [],
    setHasMore,
    page,
    postId,
    userId,
  );
};

export { getCommentsByPostId, refresh };
