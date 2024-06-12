import axios from 'axios';

import { API } from '../api';

export const getUserByUserId = async (lng, userId, setData, current_user) => {
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
