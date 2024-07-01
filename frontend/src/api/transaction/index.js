import { API } from '../base';

const getAll = (axiosJWT, accessToken, lng) => {
  try {
    const response = axiosJWT.get(API.TRANSACTION.GET_ALL, {
      headers: {
        token: `Bearer ${accessToken}`,
        'Accept-Language': lng,
      },
    });
    return response.data;
  } catch (error) {
    return error.response;
  }
};

export { getAll };
