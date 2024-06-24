import { API } from '../base';

const handleCheckUserOnline = async (
  axiosJWT,
  userId,
  accessToken,
  lng,
  setData,
) => {
  try {
    const res = await axiosJWT.post(
      API.SOCKET.ONLINE(userId),
      {},
      {
        headers: {
          token: `Bearer ${accessToken}`,
          'Accept-Language': lng,
        },
      },
    );
    setData(res.data.online);
  } catch (error) {
    setData(false);
  }
};

export { handleCheckUserOnline };
