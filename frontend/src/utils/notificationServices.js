import { BaseApi } from '../constants/constant';

const getNotificationByUserId = async (
  lng,
  setItems,
  items,
  setHasMore,
  page,
  userId,
  accessToken,
  axiosJWT,
  type,
) => {
  const url = `${BaseApi}/notification/user?_page=${page.current}&_limit=5&_order=desc&request_user=${userId}${type ? `&type=${type}` : ''}`;
  await axiosJWT
    .post(
      url,
      {},
      {
        headers: {
          token: `Bearer ${accessToken}`,
          'Accept-Language': lng,
        },
      },
    )
    .then((response) => {
      if (response.data.notifications.docs.length === 0) {
        setItems([...items]);
        setHasMore(false);
      } else {
        setItems([...items, ...response.data.notifications.docs]);
        setHasMore(response.data.notifications.docs.length === 5);
        page.current = page.current + 1;
      }
    });
};

const refresh = (
  lng,
  setItems,
  setHasMore,
  page,
  userId,
  accessToken,
  axiosJWT,
) => {
  page.current = 1;
  getNotificationByUserId(
    lng,
    setItems,
    [],
    setHasMore,
    page,
    userId,
    accessToken,
    axiosJWT,
  );
};

export { getNotificationByUserId, refresh };
