import axios from 'axios';

import { API } from '../base';

const getUserByUserId = async (lng, userId, setData, current_user) => {
  try {
    const response = await axios.post(
      API.USER.GET(userId),
      {
        request_user: current_user,
      },
      {
        headers: {
          'Accept-Language': lng,
        },
      },
    );
    setData(response.data.user);
  } catch (error) {
    setData(null);
  }
};

const getBalanceByUser = async (lng, userId, axiosJWT, accessToken) => {
  try {
    const response = await axiosJWT.get(API.USER.GET_BALANCE(userId), {
      headers: {
        token: `Bearer ${accessToken}`,
        'Accept-Language': lng,
      },
    });
    return response.data.balance;
  } catch (error) {
    return null;
  }
};

export { getUserByUserId, getBalanceByUser };
