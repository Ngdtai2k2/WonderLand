import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

import { BaseApi } from './constants/constant';

const refreshToken = async (id, device) => {
  try {
    const res = await axios.post(`${BaseApi}/auth/refresh/${id}/${device}`, {
      withCredentials: true,
    });
    return res.data;
  } catch (err) {
    console.error(err.response.data.message);
  }
};

export const createAxios = (user, dispatch, stateSuccess) => {
  const newInstance = axios.create();
  newInstance.interceptors.request.use(
    async (config) => {
      let date = new Date();
      const decodedToken = jwtDecode(user?.accessToken);
      if (decodedToken.exp < date.getTime() / 1000) {
        const data = await refreshToken(user?._id, user?.device);
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
