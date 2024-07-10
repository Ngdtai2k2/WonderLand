import { API } from '../base';

const getAllTransactions = async (
  lng,
  axiosJWT,
  accessToken,
  type,
  page,
  pageSize,
) => {
  try {
    const response = await axiosJWT.get(
      `${API.TRANSACTION.GET_ALL(type)}&_page=${page}&_limit=${pageSize}`,
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

const handleWithdrawal = async (lng, axiosJWT, accessToken, userId, data) => {
  try {
    const response = await axiosJWT.post(
      API.TRANSACTION.WITHDRAWAL(userId),
      {
        user: userId,
        amount: data.amount,
        informationWithdraw: data.informationWithdraw,
        bankMessage: data.bankMessage,
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

const confirmWithdrawal = async (
  lng,
  axiosJWT,
  accessToken,
  transactionId,
  type,
) => {
  try {
    const response = await axiosJWT.post(
      API.TRANSACTION.CONFIRM_WITHDRAWAL,
      {
        transactionId: transactionId,
        type: type,
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

const getAllTransactionsOfUser = async (
  lng,
  axiosJWT,
  accessToken,
  userId,
  type,
  page,
  pageSize,
) => {
  try {
    const response = await axiosJWT.get(
      `${API.TRANSACTION.GET_ALL_OF_USER(userId, type)}&_page=${page}&_limit=${pageSize}`,
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

export {
  getAllTransactions,
  handleWithdrawal,
  confirmWithdrawal,
  getAllTransactionsOfUser,
};
