import axios from 'axios';

const fetchData = (
  apiLink,
  setItems,
  items,
  setHasMore,
  page,
  userId,
  type,
) => {
  axios
    .post(`${apiLink}?_page=${page.current}&_limit=3`, {
      author: userId,
      type: type,
    })
    .then((res) => {
      if (res.data.result.docs.length === 0) {
        setItems([...items]);
        setHasMore(false);
      } else {
        setItems([...items, ...res.data.result.docs]);
        setHasMore(res.data.result.docs.length === 3);
        page.current = page.current + 1;
      }
    });
};

const refresh = (apiLink, setItems, setHasMore, page, userId, type) => {
  page.current = 1;
  fetchData(apiLink, setItems, [], setHasMore, page, userId, type);
};

export { fetchData, refresh };
