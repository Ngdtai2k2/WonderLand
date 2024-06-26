import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import LazyLoad from 'react-lazyload';
import { useFormik } from 'formik';
import moment from 'moment';
import * as Yup from 'yup';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import Collapse from '@mui/material/Collapse';
import Badge from '@mui/material/Badge';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';

import ArrowDropDownRoundedIcon from '@mui/icons-material/ArrowDropDownRounded';
import ArrowDropUpRoundedIcon from '@mui/icons-material/ArrowDropUpRounded';
import ThumbDownOutlinedIcon from '@mui/icons-material/ThumbDownOutlined';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import ThumbUpRoundedIcon from '@mui/icons-material/ThumbUpRounded';
import ThumbDownRoundedIcon from '@mui/icons-material/ThumbDownRounded';
import MoreVertTwoToneIcon from '@mui/icons-material/MoreVertTwoTone';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import ClearIcon from '@mui/icons-material/Clear';
import BlockRoundedIcon from '@mui/icons-material/BlockRounded';

import LoadingCircularIndeterminate from '../Loading';

import { API } from '../../api/base';
import { useToastTheme } from '../../constants/constant';
import { renderContentReply } from '../../utils/helperFunction';
import useUserAxios from '../../hooks/useUserAxios';

import { VisuallyHiddenInput } from '../../pages/styles';
import { BoxAlignCenter, ButtonLink, ImageStyle } from './styles';

export default function CommentItem({
  data,
  state,
  setState,
  delComment,
  handleShowReply,
  openCollapse,
  handleOpenMenu,
  isReply,
}) {
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);
  const [totalLike, setTotalLike] = useState(0);
  const [totalDislike, setTotalDislike] = useState(0);
  const [openReply, setOpenReply] = useState({});
  const [isFetching, setIsFetching] = useState({});
  const [fileReply, setFileReply] = useState(null);

  const navigate = useNavigate();
  const toastTheme = useToastTheme();
  const { t, i18n } = useTranslation(['post', 'validate', 'message', 'field']);
  const { user, accessToken, axiosJWT } = useUserAxios(i18n.language);

  useEffect(() => {
    setIsLiked(data?.hasReacted === true || false);
    setIsDisliked(data?.hasReacted === false || false);
    setTotalLike(data?.totalLike || 0);
    setTotalDislike(data?.totalDislike || 0);
  }, [data]);

  const validationSchema = Yup.object({
    contentReply: Yup.string().max(
      1000,
      t('validate:max', { name: t('field:comment'), max: '1000' }),
    ),
    fileReply: Yup.mixed().test(
      'fileType',
      t('validate:file.not_support'),
      (value) => {
        if (!value) return true;
        const imageTypes = [
          'image/jpeg',
          'image/png',
          'image/jpg',
          'image/gif',
        ];
        return value && imageTypes.includes(value.type);
      },
    ),
  });

  const formik = useFormik({
    initialValues: {
      contentReply: '',
      fileReply: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        setIsFetching(data._id);
        if (!user) {
          return toast.warning(t('message:need_login'), toastTheme);
        }
        if (!values.contentReply && !values[`file-${data._id}`]) {
          return toast.warning(t('validate:comment', toastTheme));
        }
        const formData = new FormData();
        formData.append('author', user?._id);
        const contentData =
          user?.nickname === data.author.nickname
            ? values.contentReply
            : `@${data.author.nickname} ${values.contentReply}`;
        formData.append('content', contentData);
        if (values[`file-${data._id}`]) {
          formData.append('fileReply', values[`file-${data._id}`]);
        }
        const commentId = isReply ? data.commentId : data._id;
        const response = await axiosJWT.put(
          API.COMMENT.REPLY(commentId),
          formData,
          {
            headers: {
              token: `Bearer ${accessToken}`,
              'Accept-Language': i18n.language,
              'Content-Type': 'multipart/form-data',
            },
          },
        );
        const newData = response.data.newComment;
        setState([...state, newData]);
        handleClearFile();
        formik.resetForm();
        if (!openCollapse[data._id]) {
          toast.success(
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography variant="caption">{response.data.message}</Typography>
              <Link
                onClick={() => handleShowReply(data._id)}
                sx={{ cursor: 'pointer', fontSize: 12 }}
                aria-label="show reply"
              >
                {t('post:comment.view_comment')}
              </Link>
            </Box>,
            toastTheme,
          );
        }
      } catch (error) {
      } finally {
        setIsFetching(null);
      }
    },
  });

  const handleClearFile = () => {
    setFileReply(null);
    formik.setFieldValue(`file-${data._id}`, null);
  };

  const handleLikeComment = async (type) => {
    if (!user) return toast.warning(t('message:need_login'), toastTheme);
    try {
      const apiUrl = isReply
        ? API.REACTION.LIKE_REPLY
        : API.REACTION.LIKE_COMMENT;
      await axiosJWT.post(
        apiUrl,
        {
          id: data?._id,
          author: user._id,
          type: type,
        },
        {
          headers: { token: `Bearer ${accessToken}` },
        },
      );

      const newIsLiked = type === 1 ? !isLiked : false;
      const newIsDisliked = type === 0 ? !isDisliked : false;

      if (isLiked !== newIsLiked) {
        setTotalLike(totalLike + (newIsLiked ? 1 : 0) - (isLiked ? 1 : 0));
        setIsLiked(newIsLiked);
      }
      if (isDisliked !== newIsDisliked) {
        setTotalDislike(
          totalDislike + (newIsDisliked ? 1 : 0) - (isDisliked ? 1 : 0),
        );
        setIsDisliked(newIsDisliked);
      }
    } catch (error) {
      toast.error(error.response.data.message, toastTheme);
    }
  };

  const handleOpenReply = (id) => {
    setOpenReply((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };
  return (
    <>
      <LazyLoad height={isReply ? 26 : 34} once>
        <Avatar
          src={data.author.media?.url}
          alt={`${data.author.fullname}'s avatar`}
          sx={{
            width: isReply ? 26 : 34,
            height: isReply ? 26 : 34,
            cursor: 'pointer',
          }}
          onClick={() => navigate(`/u/${data.author.nickname}`)}
        />
      </LazyLoad>
      <Box width="100%">
        <Box display="flex" flexDirection="row">
          <Typography
            variant={isReply ? 'caption' : 'body2'}
            fontWeight={isReply ? 700 : 600}
            display="flex"
            alignItems="flex-start"
            sx={{ cursor: 'pointer' }}
            onClick={() => navigate(`/u/${data.author.nickname}`)}
          >
            {data.author.nickname}
          </Typography>
          <Typography fontSize="10px" marginLeft={0.5}>
            {moment(data?.createdAt).fromNow()}
          </Typography>
        </Box>
        <Box display="flex" flexDirection="column">
          <Typography
            variant={isReply ? 'caption' : 'body2'}
            fontStyle={data.isHidden && 'italic'}
            display="flex"
            alignItems="center"
          >
            {data.isHidden ? (
              <>
                <BlockRoundedIcon fontSize="16px" color="error" />
                {t('post:comment.hidden')}
                <BlockRoundedIcon fontSize="16px" color="error" />
              </>
            ) : (
              renderContentReply(data.content)
            )}
          </Typography>
          {data.media?.url && <ImageStyle src={data.media?.url} alt="" />}
        </Box>
        <BoxAlignCenter
          justifyContent={isReply ? 'flex-start' : 'space-between'}
        >
          <BoxAlignCenter justifyContent="flex-start" gap={1}>
            <Link
              underline="hover"
              sx={
                isReply
                  ? { fontSize: '14px', cursor: 'pointer' }
                  : { cursor: 'pointer' }
              }
              onClick={() => handleOpenReply(data._id)}
              aria-label="show reply"
            >
              {t('post:comment.reply')}
            </Link>
            <IconButton
              aria-label="like"
              size="small"
              onClick={() => handleLikeComment(1)}
            >
              {isLiked ? (
                <ThumbUpRoundedIcon
                  color="info"
                  sx={isReply ? { fontSize: '18px' } : undefined}
                />
              ) : (
                <ThumbUpOutlinedIcon
                  sx={isReply ? { fontSize: '18px' } : undefined}
                />
              )}
            </IconButton>
            <Typography variant="body1" marginLeft={-0.7}>
              {totalLike}
            </Typography>
            <IconButton
              aria-label="dislike"
              size="small"
              onClick={() => handleLikeComment(0)}
            >
              {isDisliked ? (
                <ThumbDownRoundedIcon
                  color="error"
                  sx={isReply ? { fontSize: '18px' } : undefined}
                />
              ) : (
                <ThumbDownOutlinedIcon
                  sx={isReply ? { fontSize: '18px' } : undefined}
                />
              )}
            </IconButton>
            <Typography variant="body1" marginLeft={-0.7}>
              {totalDislike}
            </Typography>
          </BoxAlignCenter>
          <IconButton
            sx={{ zIndex: 1 }}
            id={`btn-menu-${data._id}`}
            onClick={handleOpenMenu}
          >
            {delComment === data._id ? (
              <LoadingCircularIndeterminate size={16} />
            ) : (
              <MoreVertTwoToneIcon
                sx={isReply ? { fontSize: '16px' } : undefined}
              />
            )}
          </IconButton>
        </BoxAlignCenter>
        <Collapse in={openReply[data._id]}>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            component="form"
            noValidate
            width="100%"
            gap={0.7}
            onSubmit={formik.handleSubmit}
            method="post"
          >
            <LazyLoad height={30} once>
              <Avatar
                src={user?.media?.url}
                alt={`${user?.fullname}'s avatar`}
                sx={{ width: 30, height: 30 }}
              />
            </LazyLoad>
            <TextField
              id={`content-${data._id}`}
              name="contentReply"
              fullWidth
              size="small"
              margin="normal"
              type="text"
              placeholder={t('field:enter_comment')}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Typography variant="body2">
                      {user?.nickname === data.author.nickname
                        ? null
                        : `@${data.author.nickname}`}
                    </Typography>
                  </InputAdornment>
                ),
              }}
              value={formik.values.contentReply}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.contentReply &&
                Boolean(formik.errors.contentReply)
              }
              helperText={
                formik.touched.contentReply && formik.errors.contentReply
              }
            />
            <Box>
              <IconButton
                sx={{ p: 0.5 }}
                size="small"
                onClick={() => {
                  if (user) {
                    document.getElementById(`image-reply-${data._id}`).click();
                  } else {
                    toast.warning(t('message:need_login'), toastTheme);
                  }
                }}
              >
                <AddAPhotoIcon />
              </IconButton>
              <VisuallyHiddenInput
                type="file"
                id={`image-reply-${data._id}`}
                name="fileReply"
                accept="image/*"
                onBlur={formik.handleBlur}
                onChange={(event) => {
                  const files = event.currentTarget.files[0];
                  formik.setFieldValue(`file-${data._id}`, files);
                  URL.revokeObjectURL(files);
                  setFileReply(URL.createObjectURL(files));
                }}
              />
              <IconButton
                sx={{ p: 0.5 }}
                size="small"
                type="submit"
                disabled={
                  !formik.dirty || formik.isSubmitting || !formik.isValid
                }
              >
                {isFetching === data._id ? (
                  <LoadingCircularIndeterminate size={16} />
                ) : (
                  <SendRoundedIcon />
                )}
              </IconButton>
            </Box>
            {formik.touched.fileReply && formik.errors.fileReply && (
              <Typography variant="caption" color="error">
                {formik.errors.fileReply}
              </Typography>
            )}
          </Box>

          {fileReply && (
            <Box marginLeft={6} marginTop={1}>
              <Badge
                badgeContent={<ClearIcon sx={{ fontSize: '12px' }} />}
                color="error"
                onClick={() => handleClearFile()}
                sx={{ cursor: 'pointer' }}
              >
                {/* eslint-disable-next-line jsx-a11y/img-redundant-alt */}
                <img
                  src={fileReply}
                  alt="Newly uploaded photo"
                  style={{ height: 50, objectFit: 'contain', marginTop: 5 }}
                  loading="lazy"
                />
              </Badge>
            </Box>
          )}
        </Collapse>
        {data?.replies?.length > 0 && !isReply && (
          <ButtonLink
            underline="hover"
            onClick={() => handleShowReply(data._id)}
          >
            {openCollapse[data._id] ? (
              <ArrowDropUpRoundedIcon sx={{ p: 0 }} />
            ) : (
              <ArrowDropDownRoundedIcon sx={{ p: 0 }} />
            )}
            {openCollapse[data._id]
              ? t('post:comment.hide_all')
              : `${t('post:comment.view')} ${
                  data.replies?.length
                } ${data.replies?.length !== 1 ? t('post:comment.comments') : t('post:comment.comment')}`}
          </ButtonLink>
        )}
      </Box>
    </>
  );
}
