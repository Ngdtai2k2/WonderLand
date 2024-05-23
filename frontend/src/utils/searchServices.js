import axios from 'axios';
import { BaseApi } from '../constants/constant';

const search = async (
  userId,
  query,
  data,
  setData,
  setIsLoading,
  setHasLoadMoreUser,
  setHasLoadMorePost,
  page = 1,
  limit = 5,
) => {
  try {
    setIsLoading(true);
    let requestUrl = `${BaseApi}/search?query=${query}&_limit=${limit}&_page=${page}`;

    if (userId) {
      requestUrl += `&request_user=${userId}`;
    }
    const response = await axios.post(requestUrl);

    const newData = response.data;
    if (page === 1) {
      setData(newData);
    } else {
      let updatedUsers = [];
      let updatedPosts = [];

      if (data.users && data.users.data) {
        if (data.users.data.length === 0) {
          updatedUsers = [...data.users.data];
          setHasLoadMoreUser(false);
        } else {
          updatedUsers = [...data.users.data, ...newData.users.data];
          setHasLoadMoreUser(newData.users.data.length === limit);
        }
      }
      if (data.posts && data.posts.data) {
        if (data.posts.data.length === 0) {
          updatedPosts = [...data.posts.data];
          setHasLoadMorePost(false);
        } else {
          updatedPosts = [...data.posts.data, ...newData.posts.data];
          setHasLoadMorePost(newData.posts.data.length === limit);
        }
      }

      setData({
        users: { ...data.users, data: updatedUsers },
        posts: { ...data.posts, data: updatedPosts },
      });
    }
  } catch (error) {
    setData({ users: [], posts: [] });
    console.error('Error searching:', error);
  } finally {
    setIsLoading(false);
  }
};

export default search;
