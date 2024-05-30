import axios from 'axios';
import { BaseApi } from '../constants/constant';

export const getUserByUserId = async (userId, setData) => {
  try {
    const response = await axios.get(`${BaseApi}/user/${userId}`);
    setData(response.data.user);
  } catch (error) {
    setData(null);
  }
};
