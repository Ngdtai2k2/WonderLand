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
) => {
  try {
    const response = await axiosJWT.post(
      `${BaseApi}/message/${chatId}`,
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
