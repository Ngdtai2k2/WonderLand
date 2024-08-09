  import axios from 'axios';
  import { jwtDecode } from 'jwt-decode';

import { API } from './api/base';

const refreshToken = async (id, device, lng) => {
  try {
    const res = await axios.post(
      API.AUTH.REFRESH_TOKEN(id, device),
      {},
      {
        withCredentials: true,
        headers: {
          'Accept-Language': lng,
        },
      },
    );
    return res.data;
  } catch (err) {
    console.error(err.response.data.message);
  }
};

export const createAxios = (lng, user, dispatch, stateSuccess) => {
  const newInstance = axios.create();
  newInstance.interceptors.request.use(
    async (config) => {
      let date = new Date();
      const decodedToken = jwtDecode(user?.accessToken);
      if (decodedToken.exp < date.getTime() / 1000) {
        const data = await refreshToken(user?._id, user?.device, lng);
        const refreshUser = {
          ...user,
          accessToken: data.accessToken,
        };
        if (stateSuccess) {
          dispatch(stateSuccess(refreshUser));
        }
        config.headers['token'] = 'Bearer ' + data.accessToken;
      }
      return config;
    },
    (err) => {
      return Promise.reject(err);
    },
  );
  return newInstance;
};
