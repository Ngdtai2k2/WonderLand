import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import Link from '@mui/material/Link';
import Badge from '@mui/material/Badge';

import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import ClearIcon from '@mui/icons-material/Clear';

import CustomBox from '../../components/CustomBox';
import LoadingCircularIndeterminate from '../../components/Loading';
import NoData from '../../components/NoData';
import PostCard from '../../components/PostCard';
import ListComments from '../../components/ListComments';

import { useToastTheme, BaseApi } from '../../constants/constant';
import { VisuallyHiddenInput } from '../styles';
import useUserAxios from '../../hooks/useUserAxios';

export default function PostDetail() {
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [fetching, setFetching] = useState();
  const [post, setPost] = useState();
  const [newComment, setNewComment] = useState();

  const { id } = useParams();
  const { t, i18n } = useTranslation([
    'home',
    'post',
    'message',
    'validate',
    'field',
  ]);
  const toastTheme = useToastTheme();

  const { user, accessToken, axiosJWT } = useUserAxios(i18n.language);

  const getPostById = async (id) => {
    try {
      setIsLoading(true);
      const response = await axios.post(`${BaseApi}/post/d/${id}`, {
        user: user?._id,
      }, {
        headers: {
          'Accept-Language': i18n.language,
        }
      });
      setPost(response.data.result);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setPost(null);
        toast.error('Cannot find data!', toastTheme);
      } else {
        toast.error('Something went wrong!', toastTheme);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getPostById(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    document.title = post ? post.title : 'Loading...';
  });

  const validationSchema = Yup.object({
    content: Yup.string().max(
      1000,
      t('validate:max', { name: t('field:comment'), max: '1000' }),
    ),
    file: Yup.mixed().test(
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
      content: '',
      file: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        setFetching(true);
        if (!user) {
          toast.warning(t('message:need_login'), toastTheme);
        }
        if (!values.content && !values.file) {
          return toast.warning(t('validate:comment', toastTheme));
        }
        const formData = new FormData();
        formData.append('author', user?._id);
        formData.append('postId', id);
        formData.append('content', values.content);
        if (values.file) {
          formData.append('file', values.file);
        }
        const response = await axiosJWT.post(
          `${BaseApi}/comment/create`,
          formData,
          {
            headers: {
              token: `Bearer ${accessToken}`,
              'Accept-Language': i18n.language,
              'Content-Type': 'multipart/form-data',
            },
          },
        );
        setNewComment(response.data.newComment);
        toast.success(response.data.message, toastTheme);
        handleClearFile();
        formik.resetForm();
      } catch (error) {
        toast.error(error.response.data.message, toastTheme);
      } finally {
        setFetching(false);
      }
    },
  });

  const handleClearFile = () => {
    setFile(null);
    formik.setFieldValue('file', null);
  };
  return (
    <CustomBox>
      {isLoading ? (
        <LoadingCircularIndeterminate size={50} />
      ) : post ? (
        <Box
          display="flex"
          flexDirection="column"
          width={{
            xs: '100%',
            md: '60%',
          }}
        >
          <PostCard post={post} detail={true} xs="100%" />
          <Box marginY={1.5}>
            <Box
              display="flex"
              flexDirection="column"
              alignItems="flex-start"
              justifyContent="center"
            >
              <TextField
                margin="normal"
                id="type"
                select
                name="type"
                size="small"
                defaultValue={0}
              >
                <MenuItem value={0}>{t('post:comment.hot')}</MenuItem>
                <MenuItem value={1}>{t('post:comment.new')}</MenuItem>
              </TextField>
              <Typography variant="caption">
                {t('message:comment.note')}
                <Link href="/rules" marginLeft={0.5}>
                  {t('message:comment.site_name_rules', {
                    name: t('home:site_name'),
                  })}
                </Link>
              </Typography>
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
                <Avatar
                  src={user?.media?.url}
                  alt={`${user?.fullname}'s avatar`}
                />
                <TextField
                  id="content"
                  fullWidth
                  multiline
                  rows={2}
                  size="small"
                  margin="normal"
                  type="text"
                  placeholder={t('field:enter_comment')}
                  name="content"
                  value={formik.values.content}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.content && Boolean(formik.errors.content)
                  }
                  helperText={formik.touched.content && formik.errors.content}
                />
                <Box>
                  <IconButton
                    sx={{ p: 0.5 }}
                    size="small"
                    onClick={() => {
                      if (user) {
                        document.getElementById('image').click();
                      } else {
                        toast.warning(t('message:need_login'), toastTheme);
                      }
                    }}
                  >
                    <AddAPhotoIcon />
                  </IconButton>
                  <VisuallyHiddenInput
                    type="file"
                    id="image"
                    name="image"
                    accept="image/*"
                    onBlur={formik.handleBlur}
                    onChange={(event) => {
                      const files = event.currentTarget.files[0];
                      formik.setFieldValue('file', files);
                      URL.revokeObjectURL(files);
                      setFile(URL.createObjectURL(files));
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
                    {fetching ? (
                      <LoadingCircularIndeterminate size={16} />
                    ) : (
                      <SendRoundedIcon />
                    )}
                  </IconButton>
                </Box>
              </Box>
              {file && (
                <Box marginLeft={6} marginTop={1}>
                  <Badge
                    badgeContent={<ClearIcon sx={{ fontSize: '12px' }} />}
                    color="error"
                    onClick={() => handleClearFile()}
                    sx={{ cursor: 'pointer' }}
                  >
                    {/* eslint-disable-next-line jsx-a11y/img-redundant-alt */}
                    <img
                      src={file}
                      alt="Newly uploaded photo"
                      style={{ height: 60, objectFit: 'contain', marginTop: 5 }}
                    />
                  </Badge>
                </Box>
              )}
            </Box>
          </Box>
          {/* render comments */}
          <Box marginBottom={4}>
            <ListComments postId={id} newComment={newComment} />
          </Box>
        </Box>
      ) : (
        <NoData />
      )}
    </CustomBox>
  );
}
