import axios from "axios";

const fetchData = (apiLink, setItems, items, setHasMore, page) => {
  axios.get(`${apiLink}?_page=${page.current}&_limit=10`).then((res) => {
    if (res.data.result.docs.length === 0) {
      setItems([...items]);
      setHasMore(false);
    } else {
      setItems([...items, ...res.data.result.docs]);
      setHasMore(res.data.result.docs.length === 10);
      page.current = page.current + 1;
    }
  });
};

const refresh = (apiLink, setItems, setHasMore, page) => {
  page.current = 1;
  fetchData(apiLink, setItems, [], setHasMore, page);
};

export { fetchData, refresh };
