import React, { useEffect, useRef, useState } from 'react';
import { ControlBar, Player } from 'video-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import Zoom from 'react-medium-image-zoom';
import { useTheme } from '@emotion/react';
import { toast } from 'react-toastify';
import LazyLoad from 'react-lazyload';
import moment from 'moment';

import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';

import MoreVertIcon from '@mui/icons-material/MoreVert';

import {
  IntersectionObserverOptions,
  createElementStyleForZoom,
  useToastTheme,
} from '../../constants/constant';
import { handleCloseMenu, handleOpenMenu } from '../../utils/helperFunction';
import MenuSettings from './menuSettings';
import useUserAxios from '../../hooks/useUserAxios';
// import { handleViewPost } from "../../api/posts";
import { BoxSubHeader, CardMediaStyled, CardStyled } from './styles';

import ActionButton from './actionButton';

import 'react-medium-image-zoom/dist/styles.css';

export default function PostCard({
  post,
  detail,
  sm,
  xs,
  md,
  lg,
  xl,
  setState,
}) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [menuAnchorEl, setMenuAnchorEl] = useState({});
  const [isMenuOpen, setIsMenuOpen] = useState({});

  const navigate = useNavigate();
  const theme = useTheme();
  const toastTheme = useToastTheme();
  const postRef = useRef(null);
  const { t, i18n } = useTranslation(['message', 'post']);

  const { user } = useUserAxios(i18n.language);

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
    const loadVideoStyles = async () => {
      if (videoElement) {
        await import('video-react/dist/video-react.css');
      }
    };

    const videoElement = document.querySelector('.video-react-video');

    if (videoElement) {
      loadVideoStyles();
    }

    if (isIntersecting && videoElement) {
      videoElement.play();
    } else if (!isIntersecting && videoElement) {
      videoElement.pause();
    }
  }, [isIntersecting]);

  useEffect(() => {
    createElementStyleForZoom(theme);
  }, [theme, theme.palette.mode]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && user) {
          // handleViewPost(i18n.language, post?._id, user?._id);
          observer.unobserve(postRef.current);
        }
      },
      { threshold: 0.5 },
    );

    const currentRef = postRef.current;

    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postRef]);

  return (
    <CardStyled
      ref={postRef}
      sx={{
        width: {
          xs: xs,
          sm: sm,
          md: md,
          lg: lg,
          xl: xl,
        },
      }}
      className="post-card"
    >
      <CardHeader
        avatar={
          <Link
            href={`/u/${post?.author?.nickname}`}
            underline="none"
            variant="inherit"
            aria-label={`Link to profile's ${post?.author?.nickname}`}
          >
            <LazyLoad height={48} once>
              <Avatar
                variant="rounded"
                src={post?.author?.media?.url}
                alt={post?.author?.fullname}
                sx={{ width: 48, height: 48 }}
              />
            </LazyLoad>
          </Link>
        }
        action={
          <IconButton
            aria-label="settings"
            id={`btn-post-settings-${post?._id}`}
            onClick={(event) => {
              if (!user) {
                return toast.warning(t('message:need_login'), toastTheme);
              }
              handleOpenMenu(event, post._id, setMenuAnchorEl, setIsMenuOpen);
            }}
          >
            <MoreVertIcon />
          </IconButton>
        }
        title={
          <Link
            href={`/u/${post?.author?.nickname}`}
            underline="none"
            variant="inherit"
            display="flex"
            gap={0.5}
            width="fit-content"
            aria-label={`Link to profile's ${post?.author?.nickname}`}
          >
            <Typography variant="body2" fontWeight={600}>
              {post?.author?.nickname}
            </Typography>
            <Typography variant="caption" fontSize={10}>
              {moment(post?.createdAt).fromNow()}
            </Typography>
          </Link>
        }
        subheader={
          <BoxSubHeader
            gap={0.5}
            onClick={() => navigate(`/category/${post?.category?._id}`)}
          >
            <LazyLoad height={24} once>
              <Avatar
                src={post?.category?.media?.url}
                sx={{ width: 24, height: 24 }}
                alt={post?.category?.name}
              />
            </LazyLoad>
            <Typography variant="caption" fontSize={12} width="fit-content">
              {post?.category?.name}
            </Typography>
          </BoxSubHeader>
        }
      />
      <MenuSettings
        post={post}
        menuAnchorEl={menuAnchorEl[post._id]}
        isMenuOpen={isMenuOpen[post._id]}
        handleCloseMenu={() =>
          handleCloseMenu(post._id, setMenuAnchorEl, setIsMenuOpen)
        }
        setState={setState}
      />
      <CardContent sx={{ paddingX: 1, paddingY: 0, marginBottom: 0.5 }}>
        <Typography variant="body1" fontWeight={550}>
          {!detail ? (
            <Link
              underline="hover"
              href={`/post/${post?._id}`}
              aria-label={`Link to ${post?.title}`}
            >
              {post?.title}
            </Link>
          ) : (
            post?.title
          )}
        </Typography>
        <Typography variant="body2">{post?.content}</Typography>
      </CardContent>
      {post?.media &&
        (post.media?.type === 0 ? (
          detail ? (
            <Zoom>
              <CardMediaStyled
                component="img"
                image={post.media?.url}
                alt={'Post image of ' + post?.author?.fullname}
                lazy="true"
              />
            </Zoom>
          ) : (
            <Link
              underline="none"
              href={`/post/${post?._id}`}
              aria-label={`Link to ${post?.title}`}
            >
              <CardMediaStyled
                component="img"
                image={post.media?.url}
                alt={'Post image of ' + post?.author?.fullname}
                lazy="true"
              />
            </Link>
          )
        ) : (
          <Player
            autoPlay
            muted
            playsInline
            src={post.media?.url}
            fluid={false}
            width="100%"
            height={400}
          >
            <ControlBar autoHide={true} autoHideTime={200}></ControlBar>
          </Player>
        ))}
      <ActionButton post={post} isDetail={detail} />
    </CardStyled>
  );
}
