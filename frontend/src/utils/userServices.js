import { BaseApi } from '../constants/constant';

export const getUserByUserId = async (
  axiosJWT,
  userId,
  accessToken,
  setData,
) => {
  try {
    const response = await axiosJWT.get(`${BaseApi}/user/${userId}`, {
      headers: {
        token: `Bearer ${accessToken}`,
      },
    });
    setData(response.data.user);
  } catch (error) {
    setData(null);
  }
};
