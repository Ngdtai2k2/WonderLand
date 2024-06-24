import axios from 'axios';
import { toast } from 'react-toastify';

import { API } from '../base';

const getCategories = async (setData, setLoading, toastTheme) => {
  try {
    const response = await axios.get(API.CATEGORY.BASE);
    setData(response.data.result.docs);
    setLoading(false);
  } catch (error) {
    toast.error(error.response.data.message, toastTheme);
  }
};

export default getCategories;
