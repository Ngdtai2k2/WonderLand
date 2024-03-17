import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { ControlBar, Player } from 'video-react';

import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';

import CommentIcon from '@mui/icons-material/Comment';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ShareIcon from '@mui/icons-material/Share';
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import TurnedInNotIcon from '@mui/icons-material/TurnedInNot';

import 'video-react/dist/video-react.css';
import { BoxStyled, CardActionsStyled } from './styles';

export default function PostCard({
  avatar,
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

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.85,
    };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        setIsIntersecting(entry.isIntersecting);
      });
    }, options);

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
    <Card
      sx={{
        border: '1px solid rgba(0,0,0,0.12)',
        boxShadow: 'none',
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
        avatar={<Avatar src={avatar} alt={fullname} />}
        action={
          <IconButton aria-label="settings">
            <MoreVertIcon />
          </IconButton>
        }
        title={
          <Typography variant="body2" fontWeight={600}>
            {fullname}
          </Typography>
        }
        subheader={
          <Typography variant="caption">
            Posted {moment(createdAt).fromNow()}
          </Typography>
        }
      />
      <CardContent sx={{ paddingX: 1, paddingY: 0 }}>
        <Typography variant="body1" fontWeight={550}>{title}</Typography>
        <Typography variant="body2">{content}</Typography>
      </CardContent>
      {media ? (
        media?.type === 0 ? (
          <CardMedia
            sx={{ border: '0', objectFit: 'contain', maxHeight: '400px' }}
            component="img"
            image={media.url}
            alt={'Post image of ' + fullname}
          />
        ) : (
          <Player autoPlay muted playsInline src={media.url}>
            <ControlBar autoHide={true} autoHideTime={200}></ControlBar>
          </Player>
        )
      ) : null}
      <CardActionsStyled disableSpacing>
        <BoxStyled gap={1}>
          <IconButton aria-label="like">
            <ThumbUpOffAltIcon />
          </IconButton>
          <Typography variant="subtitle1" fontWeight={500}>
            14k
          </Typography>
          <IconButton aria-label="dislike">
            <ThumbDownOffAltIcon />
          </IconButton>
        </BoxStyled>
        <Button size="small" aria-label="comments" startIcon={<CommentIcon />}>
          123k
        </Button>
        <BoxStyled>
          <IconButton aria-label="save">
            <TurnedInNotIcon />
          </IconButton>
          <IconButton aria-label="share">
            <ShareIcon />
          </IconButton>
        </BoxStyled>
      </CardActionsStyled>
    </Card>
  );
}
