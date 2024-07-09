import { API } from '../base';

const getAllTransactions = async (
  lng,
  axiosJWT,
  accessToken,
  page,
  pageSize,
) => {
  try {
    const response = await axiosJWT.get(
      `${API.TRANSACTION.GET_ALL}?_page=${page}&_limit=${pageSize}`,
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

export { getAllTransactions };
