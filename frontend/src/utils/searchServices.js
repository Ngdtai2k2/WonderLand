import axios from 'axios';

import { API } from '../api';

const searchUsers = async (
  lng,
  userId,
  query,
  data,
  setData,
  setIsLoading,
  type,
  setHasMore,
  page = 1,
  limit = 5,
) => {
  try {
    setIsLoading(true);
    const response = await axios.post(
      API.SEARCH.USERS(userId, query, limit, page),
      {
        only_friends: type === true,
      },
      {
        headers: {
          'Accept-Language': lng,
        },
      },
    );
    const newData = response.data;
    if (page === 1) {
      setData(newData);
      setHasMore(
        newData.users.data.length !== 0 && newData.users.data.length === limit,
      );
    } else {
      let updatedUsers = [];

      if (data.users && data.users.data) {
        if (data.users.data.length === 0) {
          updatedUsers = [...data.users.data];
          setHasMore(false);
        } else {
          updatedUsers = [...data.users.data, ...newData.users.data];
          setHasMore(
            newData.users.data.length === limit && newData.users.hasNextPage,
          );
        }
      }

      setData((prevData) => ({
        ...prevData,
        users: {
          ...prevData.users,
          data: updatedUsers,
        },
      }));
    }
  } catch (error) {
    setData({ users: [] });
  } finally {
    setIsLoading(false);
  }
};

const searchPosts = async (
  lng,
  userId,
  query,
  data,
  setData,
  setIsLoading,
  setHasMore,
  page = 1,
  limit = 5,
) => {
  try {
    setIsLoading(true);
    const response = await axios.post(
      API.SEARCH.POSTS(userId, query, limit, page),
      {},
      {
        headers: {
          'Accept-Language': lng,
        },
      },
    );

    const newData = response.data;

    if (page === 1) {
      setData(newData);
    } else {
      let updatedPosts = [];

      if (data.posts && data.posts.data) {
        if (data.posts.data.length === 0) {
          updatedPosts = [...data.posts.data];
          setHasMore(false);
        } else {
          updatedPosts = [...data.posts.data, ...newData.posts.data];
          setHasMore(
            newData.posts.data.length === limit && newData.posts.hasNextPage,
          );
        }
      }
      setData((prevData) => ({
        ...prevData,
        posts: {
          ...prevData.users,
          data: updatedPosts,
        },
      }));
    }
  } catch (error) {
    setData({ posts: [] });
  } finally {
    setIsLoading(false);
  }
};

export { searchUsers, searchPosts };
