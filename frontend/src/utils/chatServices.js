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
