import { API } from "../base";

const countUnreadMessages = async (userId, axiosJWT, accessToken, setData) => {
  try {
    const response = await axiosJWT.post(
      API.MESSAGE.COUNT_UNREAD(userId),
      {},
      {
        headers: {
          token: `Bearer ${accessToken}`,
        },
      }
    );
    setData(response.data.result);
  } catch (error) {
    setData(0);
  }
};

const markMessageByChatWithType = async (
  userId,
  chatId,
  type,
  axiosJWT,
  accessToken,
  setData
) => {
  try {
    const response = await axiosJWT.post(
      API.MESSAGE.MARK_MESSAGE_BY_CHAT(userId),
      {
        chatId: chatId,
        type: type,
      },
      {
        headers: {
          token: `Bearer ${accessToken}`,
        },
      }
    );
    setData(response.data.result);
  } catch (error) {
    setData(error.response.data.result);
  }
};

export { countUnreadMessages, markMessageByChatWithType };
