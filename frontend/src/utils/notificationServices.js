import { API } from '../api';

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
  await axiosJWT
    .post(
      API.NOTIFICATION.GET_BY_USER_ID(userId, page.current, 5, 'desc', type),
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
