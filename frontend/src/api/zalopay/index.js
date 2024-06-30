import { API } from '../base';

const payment = async (axiosJWT, accessToken, lng, data) => {
  try {
    const response = await axiosJWT.post(API.ZALO_PAY.CREATE_ORDER, data, {
      headers: {
        token: `Bearer ${accessToken}`,
        'Accept-Language': lng,
      },
    });
    return response;
  } catch (error) {
    return error.response;
  }
};

const checkStatus = async (transactionId, axiosJWT, accessToken, lng) => {
  try {
    const response = await axiosJWT.post(
      API.ZALO_PAY.CHECK_STATUS,
      {
        app_trans_id: transactionId,
      },
      {
        headers: {
          token: `Bearer ${accessToken}`,
          'Accept-Language': lng,
        },
      },
    );
    return response;
  } catch (error) {
    return error.response;
  }
};

export { checkStatus, payment };
