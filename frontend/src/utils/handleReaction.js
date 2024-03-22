import { useEffect, useState } from 'react';
import { BaseApi } from '../constants/constant';
import { handleDislike, handleLike } from './apiReaction';

const HandleReaction = (id, user, accessToken, navigate, axios, axiosJWT) => {
  const [countReaction, setCountReaction] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);
  const [loading, setLoading] = useState(false);

  const updateCountReaction = async () => {
    try {
      setLoading(true);
      const response = await axios.post(`${BaseApi}/reaction/count`, {
        postId: id,
      });
      setCountReaction(response.data.count);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setCountReaction(0);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const checkReactionByUserId = async () => {
      try {
        const response = await axiosJWT.post(
          `${BaseApi}/reaction/check`,
          { postId: id, author: user._id },
          {
            headers: {
              token: `Bearer ${accessToken}`,
            },
          },
        );
        if (response.data.reactionType === false) {
          setIsLiked(true);
        } else if (response.data.reactionType === true) {
          setIsDisliked(true);
        }
      } catch (error) {
        console.error('Error fetching reaction:', error);
      }
    };
    updateCountReaction();
    if (user) {
      checkReactionByUserId();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleLikeClick = async () => {
    if (!user) {
      return navigate('/login');
    }
    try {
      await handleLike(
        user,
        id,
        isLiked,
        isDisliked,
        accessToken,
        setIsLiked,
        setIsDisliked,
        axiosJWT,
      );
      await updateCountReaction();
    } catch (error) {
      console.error('Error handling like:', error);
    }
  };

  const handleDislikeClick = async () => {
    if (!user) {
      return navigate('/login');
    }
    try {
      await handleDislike(
        user,
        id,
        isLiked,
        isDisliked,
        accessToken,
        setIsLiked,
        setIsDisliked,
        axiosJWT,
      );
      await updateCountReaction();
    } catch (error) {
      console.error('Error handling dislike:', error);
    }
  };

  return {
    countReaction,
    isLiked,
    isDisliked,
    loading,
    handleLikeClick,
    handleDislikeClick,
  };
};

export default HandleReaction;
