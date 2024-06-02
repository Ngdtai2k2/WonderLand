import { toast } from 'react-toastify';
import { BaseApi } from '../constants/constant';

export const handleCreateConversation = async (
  senderId,
  receiverId,
  toastTheme,
  axiosJWT,
  accessToken,
) => {
  try {
    const res = await axiosJWT.post(
      `${BaseApi}/chat`,
      {
        senderId: senderId,
        receiverId: receiverId,
      },
      {
        headers: {
          token: `Bearer ${accessToken}`,
        },
      },
    );
    return res.data;
  } catch (error) {
    toast.error(error.response.data.message, toastTheme);
    return null;
  }
};

export const getChats = async (lng, axiosJWT, userId, accessToken, setData) => {
  try {
    const response = await axiosJWT.post(
      `${BaseApi}/chat/${userId}`,
      {},
      {
        headers: {
          token: `Bearer ${accessToken}`,
          'Accept-Language': lng,
        },
      },
    );
    setData(response.data);
  } catch (error) {
    setData([]);
  }
};

export const getMessages = async (
  lng,
  axiosJWT,
  chatId,
  accessToken,
  setData,
  user,
) => {
  try {
    const response = await axiosJWT.post(
      `${BaseApi}/message/${chatId}?request_user=${user?._id}`,
      {},
      {
        headers: {
          token: `Bearer ${accessToken}`,
          'Accept-Language': lng,
        },
      },
    );
    setData(response.data);
  } catch (error) {
    setData([]);
  }
};

export const deleteChat = async (
  lng,
  axiosJWT,
  accessToken,
  chatId,
  user,
  toastTheme,
) => {
  try {
    const response = await axiosJWT.put(
      `${BaseApi}/chat/delete/${chatId}?request_user=${user?._id}`,
      {},
      {
        headers: {
          token: `Bearer ${accessToken}`,
          'Accept-Language': lng,
        },
      },
    );
    toast.success(response.data.message, toastTheme);
  } catch (error) {
    toast.error(error.response.data.message, toastTheme);
  }
};
