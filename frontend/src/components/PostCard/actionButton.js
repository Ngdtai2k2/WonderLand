import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';

import CommentIcon from '@mui/icons-material/Comment';
import ShareIcon from '@mui/icons-material/Share';
import SportsBarRoundedIcon from '@mui/icons-material/SportsBarRounded';
import TurnedInNotRoundedIcon from '@mui/icons-material/TurnedInNotRounded';
import BookmarkRoundedIcon from '@mui/icons-material/BookmarkRounded';
import ThumbDownOutlinedIcon from '@mui/icons-material/ThumbDownOutlined';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import ThumbUpRoundedIcon from '@mui/icons-material/ThumbUpRounded';
import ThumbDownRoundedIcon from '@mui/icons-material/ThumbDownRounded';

import { handleLikePost, handleSavePost } from '../../api/posts';
import { useToastTheme } from '../../constants/constant';
import useUserAxios from '../../hooks/useUserAxios';
import { BoxStyled, CardActionsStyled } from './styles';
import {
  convertNumber,
  handleCloseMenu,
  handleOpenMenu,
} from '../../utils/helperFunction';
import MenuShare from './menuShare';

export default function ActionButton({ post, isDetail }) {
  const [totalReaction, setTotalReaction] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);
  const [isSavePost, setIsSavePost] = useState(false);
  const [menuAnchorElShare, setMenuAnchorElShare] = useState({});
  const [isMenuShareOpen, setIsMenuShareOpen] = useState({});

  useEffect(() => {
    setIsLiked(post?.hasReacted === true);
    setIsDisliked(post?.hasReacted === false);
    setIsSavePost(post?.hasSavedPost === true);
  }, [post]);

  useEffect(() => {
    setTotalReaction(post?.totalReaction);
  }, [post?.totalReaction]);

  const { t, i18n } = useTranslation(['message', 'post']);
  const toastTheme = useToastTheme();

  const { user, accessToken, axiosJWT } = useUserAxios(i18n.language);

  const handleLikeClick = async (type) => {
    if (!user) return toast.warning(t('message:need_login'), toastTheme);
    const res = await handleLikePost(
      i18n.language,
      axiosJWT,
      accessToken,
      post?._id,
      user._id,
      type,
    );
    if (res.status === 200 || res.status === 201) {
      const newIsLiked = type === 1 ? !isLiked : false;
      const newIsDisliked = type === 0 ? !isDisliked : false;
      const reactionChanged =
        isLiked !== newIsLiked || isDisliked !== newIsDisliked;

      let updatedTotalReaction = totalReaction;
      if (reactionChanged) {
        updatedTotalReaction =
          totalReaction +
          (newIsLiked ? 1 : 0) -
          (isLiked ? 1 : 0) +
          (newIsDisliked ? 1 : 0) -
          (isDisliked ? 1 : 0);
      }

      setIsLiked(newIsLiked);
      setIsDisliked(newIsDisliked);
      setTotalReaction(updatedTotalReaction);
    } else {
      toast.error(res.data.message, toastTheme);
    }
  };

  const handleSavePostClick = async () => {
    if (!user) return toast.warning(t('message:need_login'), toastTheme);
    const res = await handleSavePost(
      i18n.language,
      post?._id,
      user._id,
      axiosJWT,
      accessToken,
    );
    if (res.status === 200 || res.status === 201) {
      setIsSavePost(res?.data?.state);
      toast.success(res?.data?.message, toastTheme);
    } else {
      toast.error(res.data.message, toastTheme);
    }
  };

  return (
    <CardActionsStyled disableSpacing>
      <BoxStyled gap={1}>
        <IconButton
          onClick={() => handleLikeClick(1)}
          aria-label="like"
          size="small"
        >
          {isLiked ? (
            <ThumbUpRoundedIcon color="info" />
          ) : (
            <ThumbUpOutlinedIcon />
          )}
        </IconButton>
        <Typography
          variant="subtitle1"
          fontWeight={400}
          width="100%"
          textAlign="center"
        >
          {convertNumber(totalReaction)}
        </Typography>
        <IconButton
          onClick={() => handleLikeClick(0)}
          aria-label="dislike"
          size="small"
        >
          {isDisliked ? (
            <ThumbDownRoundedIcon color="error" />
          ) : (
            <ThumbDownOutlinedIcon />
          )}
        </IconButton>
      </BoxStyled>

      {!isDetail && (
        <Button
          size="small"
          aria-label="comments"
          startIcon={<CommentIcon />}
          onClick={() => window.open(`/post/${post?._id}`, '_blank')}
        >
          {convertNumber(post?.totalComment)}
        </Button>
      )}

      <BoxStyled>
        <Tooltip title={t('post:action.donate')}>
          <IconButton
            aria-label={t('post:action.donate')}
            size="small"
          >
            <SportsBarRoundedIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title={t('post:action.save')}>
          <IconButton
            aria-label={t('post:action.save')}
            size="small"
            onClick={() => handleSavePostClick()}
          >
            {isSavePost ? (
              <BookmarkRoundedIcon color="warning" />
            ) : (
              <TurnedInNotRoundedIcon />
            )}
          </IconButton>
        </Tooltip>
        <Tooltip title={t('post:action.share')}>
          <IconButton
            aria-label={t('post:action.share')}
            size="small"
            id={`btn-post-share-${post?._id}`}
            onClick={(event) => {
              handleOpenMenu(
                event,
                post._id,
                setMenuAnchorElShare,
                setIsMenuShareOpen,
              );
            }}
          >
            <ShareIcon />
          </IconButton>
        </Tooltip>
        <MenuShare
          post={post}
          menuAnchorEl={menuAnchorElShare[post?._id]}
          isMenuOpen={isMenuShareOpen[post?._id]}
          handleCloseMenu={() =>
            handleCloseMenu(post._id, setMenuAnchorElShare, setIsMenuShareOpen)
          }
        />
      </BoxStyled>
    </CardActionsStyled>
  );
}
