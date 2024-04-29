import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { ControlBar, Player } from "video-react";
import { toast } from "react-toastify";

import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";

import CommentIcon from "@mui/icons-material/Comment";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ShareIcon from "@mui/icons-material/Share";
import TurnedInNotRoundedIcon from "@mui/icons-material/TurnedInNotRounded";
import BookmarkRoundedIcon from "@mui/icons-material/BookmarkRounded";
import ThumbDownOutlinedIcon from "@mui/icons-material/ThumbDownOutlined";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import ThumbUpRoundedIcon from "@mui/icons-material/ThumbUpRounded";
import ThumbDownRoundedIcon from "@mui/icons-material/ThumbDownRounded";

import { createAxios } from "../../createInstance";
import {
  BaseApi,
  IntersectionObserverOptions,
  useToastTheme,
} from "../../constants/constant";
import { convertNumber } from "../../utils/helperFunction";
import { BoxStyled, CardActionsStyled, CardStyled } from "./styles";
import "video-react/dist/video-react.css";

export default function PostCard({ post, detail, sm, xs, md, lg, xl }) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [totalReaction, setTotalReaction] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);
  const [isSavePost, setIsSavePost] = useState(false);

  const dispatch = useDispatch();
  const toastTheme = useToastTheme();

  const user = useSelector((state) => state.auth.login?.currentUser);
  const accessToken = user?.accessToken;
  let axiosJWT = createAxios(user, dispatch);

  useEffect(() => {
    setIsLiked(post?.hasReacted === true);
    setIsDisliked(post?.hasReacted === false);
    setIsSavePost(post?.hasSavedPost === true);
  }, [post]);

  useEffect(() => {
    setTotalReaction(post?.totalReaction);
  }, [post?.totalReaction]);

  const handleLikeClick = async (type) => {
    if (!user)
      return toast.warning(
        "You need to be signed in to perform this action!",
        toastTheme
      );
    try {
      await axiosJWT.post(
        `${BaseApi}/reaction/like`,
        {
          id: post?._id,
          author: user._id,
          type: type,
        },
        {
          headers: {
            token: `Bearer ${accessToken}`,
          },
        }
      );

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
    } catch (error) {
      toast.error(error.response.data.message, toastTheme);
    }
  };

  const handleSavePost = async () => {
    if (!user)
      return toast.warning(
        "You need to be signed in to perform this action!",
        toastTheme
      );
    try {
      const response = await axiosJWT.post(
        `${BaseApi}/save-post`,
        {
          id: post?._id,
          user: user._id,
        },
        {
          headers: {
            token: `Bearer ${accessToken}`,
          },
        }
      );
      setIsSavePost(response?.data?.state);
      toast.success(response?.data?.message, toastTheme);
    } catch (error) {
      toast.error(error.response.data.message, toastTheme);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        setIsIntersecting(entry.isIntersecting);
      });
    }, IntersectionObserverOptions);

    const target = document.querySelector(".video-react-video");
    if (target) {
      observer.observe(target);
    }
    return () => {
      if (target) {
        observer.unobserve(target);
      }
    };
  }, []);

  useEffect(() => {
    const videoElement = document.querySelector(".video-react-video");

    if (isIntersecting && videoElement) {
      videoElement.play();
    } else if (!isIntersecting && videoElement) {
      videoElement.pause();
    }
  }, [isIntersecting]);

  return (
    <CardStyled
      sx={{
        width: {
          xs: xs,
          sm: sm,
          md: md,
          lg: lg,
          xl: xl,
        },
      }}
    >
      <CardHeader
        avatar={
          <Link
            href={`/profile/u/${post?.author?._id}`}
            underline="none"
            variant="inherit"
          >
            <Avatar
              variant="rounded"
              src={post?.author?.media?.url}
              alt={post?.author?.fullname}
            />
          </Link>
        }
        action={
          <IconButton aria-label="settings">
            <MoreVertIcon />
          </IconButton>
        }
        title={
          <Link
            href={`/profile/u/${post?.author?._id}`}
            underline="none"
            variant="inherit"
          >
            <Typography variant="body2" fontWeight={600}>
              {post?.author?.fullname}
            </Typography>
          </Link>
        }
        subheader={
          <Typography variant="caption">
            Posted {moment(post?.createdAt).fromNow()}
          </Typography>
        }
      />
      <CardContent sx={{ paddingX: 1, paddingY: 0, marginBottom: 0.5 }}>
        <Typography variant="body1" fontWeight={550}>
          {!detail ? (
            <Link underline="hover" href={`/post/${post?._id}`}>
              {post?.title}
            </Link>
          ) : (
            post?.title
          )}
        </Typography>
        <Typography variant="body2">{post?.content}</Typography>
      </CardContent>
      {post?.media ? (
        post.media?.type === 0 ? (
          <Link underline="none" href={detail ? null : `/post/${post?._id}`}>
            <CardMedia
              sx={{
                border: "0",
                objectFit: "contain",
                maxHeight: "400px",
                cursor: "pointer",
              }}
              component="img"
              image={post.media?.url}
              alt={"Post image of " + post?.author?.fullname}
              lazy="true"
            />
          </Link>
        ) : (
          <Player autoPlay muted playsInline src={post.media?.url}>
            <ControlBar autoHide={true} autoHideTime={200}></ControlBar>
          </Player>
        )
      ) : null}
      <CardActionsStyled disableSpacing>
        <BoxStyled gap={1}>
          <IconButton
            onClick={() => handleLikeClick(1, setIsLiked)}
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
            onClick={() => handleLikeClick(0, setIsDisliked)}
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
        {!detail && (
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
          <IconButton
            aria-label="save"
            size="small"
            onClick={() => {
              handleSavePost();
            }}
          >
            {isSavePost ? (
              <BookmarkRoundedIcon color="warning" />
            ) : (
              <TurnedInNotRoundedIcon />
            )}
          </IconButton>
          <IconButton aria-label="share" size="small">
            <ShareIcon />
          </IconButton>
        </BoxStyled>
      </CardActionsStyled>
    </CardStyled>
  );
}
