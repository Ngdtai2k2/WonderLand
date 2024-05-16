import axios from 'axios';
import { BaseApi } from '../constants/constant';
import { toast } from 'react-toastify';

const getPosts = (apiLink, setItems, items, setHasMore, page, user, type) => {
  axios
    .post(`${apiLink}_page=${page.current}&_limit=5`, {
      request_user: user,
      type: type,
    })
    .then((res) => {
      if (res.data.result.docs.length === 0) {
        setItems([...items]);
        setHasMore(false);
      } else {
        setItems([...items, ...res.data.result.docs]);
        setHasMore(res.data.result.docs.length === 5);
        page.current = page.current + 1;
      }
    });
};

const refresh = (apiLink, setItems, setHasMore, page, user, type) => {
  page.current = 1;
  getPosts(apiLink, setItems, [], setHasMore, page, user, type);
};

const handleViewPost = async (postId, userId) => {
  try {
    await axios.post(`${BaseApi}/post/view`, {
      postId: postId,
      userId: userId,
    });
  } catch (error) {
    console.error(error.response.data.message);
  }
};

const handleDeletePost = async (
  postId,
  userId,
  axiosJWT,
  accessToken,
  toastTheme,
  setState,
) => {
  try {
    const response = await axiosJWT.delete(
      `${BaseApi}/post/delete/${postId}?request_user=${userId}`,
      {
        headers: {
          token: `Bearer ${accessToken}`,
        },
      },
    );
    toast.success(response?.data?.message, toastTheme);
    setState(Math.floor(Math.random() * 1000));
  } catch (error) {
    toast.error(error?.response?.data?.message, toastTheme);
  }
};

export { getPosts, refresh, handleViewPost, handleDeletePost };
