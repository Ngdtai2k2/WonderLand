import { toast } from 'react-toastify';
import { BaseApi, toastTheme } from '../constants/constant';

export const handleLike = async (
  user,
  id,
  isLiked,
  isDisliked,
  accessToken,
  setIsLiked,
  setIsDisliked,
  axiosJWT,
) => {
  try {
    if (isLiked) {
      await axiosJWT.post(
        `${BaseApi}/reaction/delete`,
        { author: user._id, postId: id, type: 0 },
        {
          headers: {
            'Content-Type': 'application/json',
            token: `Bearer ${accessToken}`,
          },
        },
      );
      setIsLiked(false);
    } else {
      if (isDisliked) {
        await axiosJWT.post(
          `${BaseApi}/reaction/delete`,
          { author: user?._id, postId: id, type: 1 },
          {
            headers: {
              'Content-Type': 'application/json',
              token: `Bearer ${accessToken}`,
            },
          },
        );
        setIsDisliked(false);
      }
      await axiosJWT.post(
        `${BaseApi}/reaction`,
        {
          type: 0,
          author: user?._id,
          postId: id,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            token: `Bearer ${accessToken}`,
          },
        },
      );
      setIsLiked(true);
    }
  } catch (error) {
    toast.error(error.message, toastTheme);
  }
};

export const handleDislike = async (
  user,
  id,
  isLiked,
  isDisliked,
  accessToken,
  setIsLiked,
  setIsDisliked,
  axiosJWT,
) => {
  try {
    if (isDisliked) {
      await axiosJWT.post(
        `${BaseApi}/reaction/delete`,
        { author: user?._id, postId: id, type: 1 },
        {
          headers: {
            'Content-Type': 'application/json',
            token: `Bearer ${accessToken}`,
          },
        },
      );
      setIsDisliked(false);
    } else {
      if (isLiked) {
        await axiosJWT.post(
          `${BaseApi}/reaction/delete`,
          { author: user?._id, postId: id, type: 0 },
          {
            headers: {
              'Content-Type': 'application/json',
              token: `Bearer ${accessToken}`,
            },
          },
        );
        setIsLiked(false);
      }
      await axiosJWT.post(
        `${BaseApi}/reaction`,
        { author: user?._id, postId: id, type: 1 },
        {
          headers: {
            'Content-Type': 'application/json',
            token: `Bearer ${accessToken}`,
          },
        },
      );
      setIsDisliked(true);
    }
  } catch (error) {
    toast.error(error.message, toastTheme);
  }
};
