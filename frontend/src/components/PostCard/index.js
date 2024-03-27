import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import moment from 'moment';
import { ControlBar, Player } from 'video-react';
import { useNavigate } from 'react-router-dom';

import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';

import CommentIcon from '@mui/icons-material/Comment';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ShareIcon from '@mui/icons-material/Share';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import TurnedInNotIcon from '@mui/icons-material/TurnedInNot';
import ThumbDownRoundedIcon from '@mui/icons-material/ThumbDownRounded';
import ThumbDownOffAltRoundedIcon from '@mui/icons-material/ThumbDownOffAltRounded';
import { IntersectionObserverOptions } from '../../constants/constant';

import LoadingCircularIndeterminate from '../Loading';
import HandleReaction from '../../utils/handleReaction';
import { convertNumber } from '../../utils/helperFunction';
import { createAxios } from '../../createInstance';

import { BoxStyled, CardActionsStyled, CardStyled } from './styles';
import 'video-react/dist/video-react.css';

export default function PostCard({
  id,
  avatar,
  authorId,
  fullname,
  title,
  content,
  media,
  createdAt,
  sm,
  xs,
  md,
  lg,
  xl,
}) {
  const [isIntersecting, setIsIntersecting] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state) => state.auth.login?.currentUser);
  const accessToken = user?.accessToken;
  let axiosJWT = createAxios(user, dispatch);

  const {
    countReaction,
    isLiked,
    isDisliked,
    loading,
    handleLikeClick,
    handleDislikeClick,
  } = HandleReaction(id, user, accessToken, navigate, axios, axiosJWT);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        setIsIntersecting(entry.isIntersecting);
      });
    }, IntersectionObserverOptions);

    const target = document.querySelector('.video-react-video');
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
    const videoElement = document.querySelector('.video-react-video');

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
            href={`/profile/${authorId}`}
            underline="none"
            variant="inherit"
          >
            <Avatar variant="rounded" src={avatar} alt={fullname} />
          </Link>
        }
        action={
          <IconButton aria-label="settings">
            <MoreVertIcon />
          </IconButton>
        }
        title={
          <Link
            href={`/profile/${authorId}`}
            underline="none"
            variant="inherit"
          >
            <Typography variant="body2" fontWeight={600}>
              {fullname}
            </Typography>
          </Link>
        }
        subheader={
          <Typography variant="caption">
            Posted {moment(createdAt).fromNow()}
          </Typography>
        }
      />
      <CardContent sx={{ paddingX: 1, paddingY: 0 }}>
        <Typography variant="body1" fontWeight={550}>
          {title}
        </Typography>
        <Typography variant="body2">{content}</Typography>
      </CardContent>
      {media ? (
        media?.type === 0 ? (
          <CardMedia
            sx={{ border: '0', objectFit: 'contain', maxHeight: '400px' }}
            component="img"
            image={media.url}
            alt={'Post image of ' + fullname}
            lazy={true}
          />
        ) : (
          <Player autoPlay muted playsInline src={media.url}>
            <ControlBar autoHide={true} autoHideTime={200}></ControlBar>
          </Player>
        )
      ) : null}
      <CardActionsStyled disableSpacing>
        <BoxStyled gap={1}>
          <IconButton aria-label="like" onClick={handleLikeClick} size="small">
            {isLiked ? <ThumbUpIcon color="info" /> : <ThumbUpOffAltIcon />}
          </IconButton>
          {loading ? (
            <LoadingCircularIndeterminate size={10} />
          ) : (
            <Typography
              variant="subtitle1"
              fontWeight={400}
              width="100%"
              textAlign="center"
            >
              {convertNumber(countReaction)}
            </Typography>
          )}
          <IconButton
            aria-label="dislike"
            onClick={handleDislikeClick}
            size="small"
          >
            {isDisliked ? (
              <ThumbDownRoundedIcon color="error" />
            ) : (
              <ThumbDownOffAltRoundedIcon />
            )}
          </IconButton>
        </BoxStyled>
        <Button size="small" aria-label="comments" startIcon={<CommentIcon />}>
          123k
        </Button>
        <BoxStyled>
          <IconButton aria-label="save" size="small">
            <TurnedInNotIcon />
          </IconButton>
          <IconButton aria-label="share" size="small">
            <ShareIcon />
          </IconButton>
        </BoxStyled>
      </CardActionsStyled>
    </CardStyled>
  );
}
