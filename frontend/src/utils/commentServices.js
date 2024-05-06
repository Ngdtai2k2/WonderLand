import axios from 'axios';

import { BaseApi } from '../constants/constant';

// function support for get comments
const getCommentsByPostId = async (
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
    .post(`${BaseApi}/comment/post/${postId}?_page=${page.current}&_limit=10`, {
      userId: userId,
    })
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
const refresh = (setIsLoading, setItems, setHasMore, page, postId, userId) => {
  page.current = 1;
  getCommentsByPostId(
    setIsLoading,
    setItems,
    [],
    setHasMore,
    page,
    postId,
    userId,
  );
};

// function support for open and close menu anchors
const handleOpenMenu = (
  event,
  id,
  setStatesMenuAnchor,
  setStatesIsMenuOpen,
) => {
  setStatesMenuAnchor((prev) => ({
    ...prev,
    [id]: event.currentTarget,
  }));
  setStatesIsMenuOpen((prev) => ({
    ...prev,
    [id]: true,
  }));
};

const handleCloseMenu = (id, setStatesMenuAnchor, setStatesIsMenuOpen) => {
  setStatesMenuAnchor((prev) => ({
    ...prev,
    [id]: null,
  }));
  setStatesIsMenuOpen((prev) => ({
    ...prev,
    [id]: false,
  }));
};

export { getCommentsByPostId, refresh, handleOpenMenu, handleCloseMenu };
