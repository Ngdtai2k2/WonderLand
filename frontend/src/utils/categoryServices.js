import axios from 'axios';
import { toast } from 'react-toastify';

import { BaseApi } from '../constants/constant';

const getCategories = async (setData, setLoading, toastTheme) => {
  try {
    const response = await axios.get(BaseApi + '/category');
    setData(response.data.result.docs);
    setLoading(false);
  } catch (error) {
    toast.error(error.response.data.message, toastTheme);
  }
};

export default getCategories;
