import { BaseApi } from '../constants/constant';

const getNotificationByUserId = async (
  setItems,
  items,
  setHasMore,
  page,
  userId,
  accessToken,
  axiosJWT,
) => {
  await axiosJWT
    .post(
      `${BaseApi}/notification/user?_page=${page.current}&_limit=5&_order=desc&request_user=${userId}`,
      {
        headers: {
          token: `Bearer ${accessToken}`,
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

const refresh = (setItems, setHasMore, page, userId, accessToken, axiosJWT) => {
  page.current = 1;
  getNotificationByUserId(
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
