import axios from 'axios';
import { toast } from 'react-toastify';

import { API } from '../base';

const getPosts = (apiLink, setItems, items, setHasMore, page, user, type) => {
  axios
    .post(`${apiLink}_page=${page.current}&_limit=3`, {
      request_user: user,
      type: type,
    })
    .then((res) => {
      if (res.data.result.docs.length === 0) {
        setItems([...items]);
        setHasMore(false);
      } else {
        setItems([...items, ...res.data.result.docs]);
        setHasMore(res.data.result.docs.length === 3);
        page.current = page.current + 1;
      }
    });
};

const refresh = (apiLink, setItems, setHasMore, page, user, type) => {
  page.current = 1;
  getPosts(apiLink, setItems, [], setHasMore, page, user, type);
};

const handleViewPost = async (lng, postId, userId) => {
  try {
    await axios.post(
      API.POST.VIEW,
      {
        postId: postId,
        userId: userId,
      },
      {
        headers: {
          'Accept-Language': lng,
        },
      },
    );
  } catch (error) {
    console.error(error.response.data.message);
  }
};

const handleDeletePost = async (
  lng,
  postId,
  userId,
  axiosJWT,
  accessToken,
  toastTheme,
  setState,
) => {
  try {
    const response = await axiosJWT.delete(API.POST.DELETE(postId, userId), {
      headers: {
        token: `Bearer ${accessToken}`,
        'Accept-Language': lng,
      },
    });
    toast.success(response?.data?.message, toastTheme);
    setState(Math.floor(Math.random() * 1000));
  } catch (error) {
    toast.error(error?.response?.data?.message, toastTheme);
  }
};

const getPostById = async (lng, postId, setData, toastTheme) => {
  try {
    const response = await axios.post(
      API.POST.DETAIL(postId),
      {},
      {
        headers: {
          'Accept-Language': lng,
        },
      },
    );
    setData(response.data.result);
  } catch (error) {
    if (error.response && error.response.status === 404) {
      setData(null);
      toast.error('Cannot find data!', toastTheme);
    } else {
      toast.error('Something went wrong!', toastTheme);
    }
  }
};

const handleSavePost = async (lng, postId, userId, axiosJWT, accessToken) => {
  try {
    const response = await axiosJWT.post(
      API.SAVE_POST.BASE,
      {
        id: postId,
        user: userId,
      },
      {
        headers: {
          token: `Bearer ${accessToken}`,
          'Accept-Language': lng,
        },
      },
    );
    return response;
  } catch (error) {
    return error.response;
  }
};

const handleLikePost = async (
  lng,
  axiosJWT,
  accessToken,
  postId,
  userId,
  type,
) => {
  try {
    const response = await axiosJWT.post(
      API.REACTION.LIKE_POST,
      {
        id: postId,
        author: userId,
        type: type,
      },
      {
        headers: {
          token: `Bearer ${accessToken}`,
          'Accept-Language': lng,
        },
      },
    );
    return response;
  } catch (error) {
    return error.response;
  }
};

export {
  getPosts,
  refresh,
  handleViewPost,
  handleDeletePost,
  getPostById,
  handleSavePost,
  handleLikePost,
};
