import { toast } from 'react-toastify';

import { API } from '../api';

const getFriendsList = async (
  lng,
  apiLink,
  axiosJWT,
  accessToken,
  page,
  user,
  setData,
  data,
  setHasMore,
  setLoading,
) => {
  setLoading(true);
  await axiosJWT
    .post(
      `${apiLink}?_page=${page.current}&_limit=10&request_user=${user?._id}`,
      {},
      {
        headers: {
          token: `Bearer ${accessToken}`,
          'Accept-Language': lng,
        },
      },
    )
    .then((res) => {
      setLoading(false);
      if (res.data.docs.length === 0) {
        setData([...data]);
        setHasMore(false);
      } else {
        setData([...data, ...res.data.docs]);
        setHasMore(res.data.docs.length === 10);
        page.current = page.current + 1;
      }
    });
};

const refreshFriendList = (
  lng,
  apiLink,
  axiosJWT,
  accessToken,
  page,
  user,
  setData,
  setHasMore,
) => {
  page.current = 1;
  getFriendsList(
    lng,
    apiLink,
    axiosJWT,
    accessToken,
    page,
    user,
    setData,
    [],
    setHasMore,
  );
};

const deleteFriend = async (
  t,
  lng,
  user,
  currentUser,
  axiosJWT,
  accessToken,
  toastTheme,
) => {
  try {
    if (!user) {
      return toast.warning(t('message:need_login'), toastTheme);
    }
    const response = await axiosJWT.post(
      API.FRIEND.DELETE(user?._id),
      {
        userId: user?._id,
        // User ID on Params
        friendId: currentUser,
      },
      {
        headers: {
          token: `Bearer ${accessToken}`,
          'Accept-Language': lng,
        },
      },
    );
    toast.success(response.data.message, toastTheme);
    return { success: true };
  } catch (error) {
    toast.error(error.response.data.message, toastTheme);
    return { success: false };
  }
};

const acceptRequestAddFriend = async (
  t,
  lng,
  user,
  currentUser,
  axiosJWT,
  accessToken,
  toastTheme,
) => {
  try {
    if (!user) {
      return toast.warning(t('message:need_login'), toastTheme);
    }
    const response = await axiosJWT.post(
      API.FRIEND.ACCEPT_REQUEST,
      {
        userId: currentUser,
        friendId: user?._id,
      },
      {
        headers: {
          token: `Bearer ${accessToken}`,
          'Accept-Language': lng,
        },
      },
    );
    toast.success(response.data.message, toastTheme);
    return { success: true };
  } catch (error) {
    toast.error(error.response.data.message, toastTheme);
    return { success: false };
  }
};

const cancelRequestAddFriend = async (
  t,
  lng,
  user,
  currentUser,
  axiosJWT,
  accessToken,
  toastTheme,
) => {
  try {
    if (!user) {
      return toast.warning(t('message:need_login'), toastTheme);
    }
    const response = await axiosJWT.post(
      API.FRIEND.CANCEL_REQUEST,
      {
        userId: user?._id,
        friendId: currentUser,
      },
      {
        headers: {
          token: `Bearer ${accessToken}`,
          'Accept-Language': lng,
        },
      },
    );
    toast.success(response.data.message, toastTheme);
    return { success: true };
  } catch (error) {
    toast.error(error.response.data.message, toastTheme);
    return { success: false };
  }
};

const sendRequestAddFriend = async (
  t,
  lng,
  user,
  currentUser,
  axiosJWT,
  accessToken,
  toastTheme,
) => {
  try {
    if (!user) {
      return toast.warning(t('message:need_login'), toastTheme);
    }
    const response = await axiosJWT.post(
      API.FRIEND.SEND_REQUEST,
      {
        userId: user?._id,
        friendId: currentUser,
      },
      {
        headers: {
          token: `Bearer ${accessToken}`,
          'Accept-Language': lng,
        },
      },
    );
    toast.success(response.data.message, toastTheme);
    return { success: true };
  } catch (error) {
    toast.error(error.response.data.message, toastTheme);
    return { success: false };
  }
};

export {
  getFriendsList,
  refreshFriendList,
  deleteFriend,
  acceptRequestAddFriend,
  cancelRequestAddFriend,
  sendRequestAddFriend,
};
