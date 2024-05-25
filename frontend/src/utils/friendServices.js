const getFriendsList = async (
  apiLink,
  axiosJWT,
  accessToken,
  page,
  user,
  setData,
  data,
  setHasMore,
) => {
  await axiosJWT
    .post(
      `${apiLink}?_page=${page.current}&_limit=10&request_user=${user?._id}`,
      {
        headers: {
          token: `Bearer ${accessToken}`,
        },
      },
    )
    .then((res) => {
      if (res.data.docs.length === 0) {
        setData([...data]);
        setHasMore(false);
      } else {
        setData([...data, ...res.data.docs]);
        setHasMore(res.data.docs.length === 10);
        page.current = page.current + 1;
      }
    });
};

const refreshFriendList = (
  apiLink,
  axiosJWT,
  accessToken,
  page,
  user,
  setData,
  setHasMore,
) => {
  page.current = 1;
  getFriendsList(
    apiLink,
    axiosJWT,
    accessToken,
    page,
    user,
    setData,
    [],
    setHasMore,
  );
};

export { getFriendsList, refreshFriendList };
