import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import MenuItem from '@mui/material/MenuItem';

import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CreateRoundedIcon from '@mui/icons-material/CreateRounded';
import DeleteIcon from '@mui/icons-material/Delete';

import LoadingCircularIndeterminate from '../../components/Loading';

import { API } from '../../api';
import useUserAxios from '../../hooks/useUserAxios';
import { useToastTheme } from '../../constants/constant';

import { FlexCenterBox } from './styles';
import { VisuallyHiddenInput } from '../styles';

export default function PostTab() {
  const [category, setCategory] = useState(null);
  const [file, setFile] = useState(null);
  const [typeFile, setTypeFile] = useState(false);
  const [loading, setLoading] = useState(true);
  const [fetching, setFetching] = useState();

  const navigate = useNavigate();
  const toastTheme = useToastTheme();
  const { t, i18n } = useTranslation(['post', 'validate', 'message', 'field']);
  const { user, accessToken, axiosJWT } = useUserAxios(i18n.language);

  useEffect(() => {
    const getCategory = async () => {
      try {
        const response = await axios.get(API.CATEGORY.BASE);
        setCategory(response.data.result.docs);
        setLoading(false);
      } catch (error) {
        toast.error(error.response.data.message, toastTheme);
      }
    };
    getCategory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const validationSchema = Yup.object({
    category: Yup.string().required(
      t('validate:required_field', { name: t('field:category') }),
    ),
    title: Yup.string()
      .required(t('validate:required_field', { name: t('field:title') }))
      .max(280, t('validate:max', { name: t('field:title'), max: '280' })),
    file: Yup.mixed()
      .required('File is required!')
      .test('fileType', t('validate:file.not_support'), (value) => {
        if (!value) return true;
        const imageTypes = [
          'image/jpeg',
          'image/png',
          'image/jpg',
          'image/gif',
        ];
        const videoTypes = ['video/mp4', 'video/mkv'];
        return (
          value &&
          (imageTypes.includes(value.type) || videoTypes.includes(value.type))
        );
      }),
  });

  const formik = useFormik({
    initialValues: { category: '', title: '', file: '' },
    validationSchema,
    onSubmit: async (values) => {
      try {
        setFetching(true);
        const formData = new FormData();
        formData.append('author', user?._id);
        formData.append('type', 0);
        Object.entries(values).forEach(([key, value]) => {
          formData.append(key, value);
        });

        const response = await axiosJWT.post(API.POST.CREATE, formData, {
          headers: {
            'Accept-Language': i18n.language,
            'Content-Type': 'multipart/form-data',
            token: `Bearer ${accessToken}`,
          },
        });
        toast.success(response.data.message, toastTheme);
        navigate('/');
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

  return loading ? (
    <LoadingCircularIndeterminate />
  ) : (
    <Box
      component="form"
      noValidate
      method="POST"
      onSubmit={formik.handleSubmit}
      display="flex"
      justifyContent="center"
      flexDirection="column"
    >
      <Typography variant="caption">{t('message:post.note_create')}</Typography>
      <TextField
        required
        margin="normal"
        id="category"
        select
        label={t('field:category')}
        name="category"
        fullWidth
        value={formik.values.category}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.category && Boolean(formik.errors.category)}
        helperText={formik.touched.category && formik.errors.category}
      >
        {category &&
          category.map((item) => (
            <MenuItem key={item._id} value={item._id}>
              <Box display="flex" alignItems="center" gap={2}>
                <Avatar
                  variant="square"
                  alt={item.media?.description}
                  src={item.media?.url}
                  sx={{ width: 32, height: 32 }}
                />
                <Typography variant="body1">{item.name}</Typography>
              </Box>
            </MenuItem>
          ))}
      </TextField>
      <TextField
        margin="normal"
        required
        id="title"
        name="title"
        label={t('field:title')}
        type="text"
        value={formik.values.title}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.title && Boolean(formik.errors.title)}
        helperText={formik.touched.title && formik.errors.title}
      />
      <Paper variant="outlined" sx={{ p: 2, marginY: 1 }}>
        <Box display="flex" flexDirection="column" width="100%" maxHeight={500}>
          {file ? (
            <FlexCenterBox marginY={1}>
              <Button
                startIcon={<DeleteIcon />}
                onClick={handleClearFile}
                variant="outlined"
              >
                {t('post:clear_file')}
              </Button>
            </FlexCenterBox>
          ) : (
            <>
              <Button
                component="label"
                role={undefined}
                variant="outlined"
                tabIndex={-1}
              >
                <VisuallyHiddenInput
                  type="file"
                  id="file"
                  name="file"
                  accept="image/*,video/*"
                  onBlur={formik.handleBlur}
                  onChange={(event) => {
                    const files = event.currentTarget.files[0];
                    formik.setFieldValue('file', files);
                    URL.revokeObjectURL(files);
                    setFile(URL.createObjectURL(files));
                    setTypeFile(files.type.startsWith('image/'));
                  }}
                />
                <FlexCenterBox flexDirection="column">
                  <CloudUploadIcon />
                  <Typography variant="body1">
                    {' '}
                    {t('post:choose_file')}
                  </Typography>
                </FlexCenterBox>
              </Button>
              <Typography
                variant="caption"
                fontStyle="italic"
                textAlign="center"
              >
                {t('validate:file.support')}
              </Typography>
            </>
          )}
          {file ? (
            typeFile ? (
              <img
                src={file}
                alt=""
                style={{ height: 300, objectFit: 'contain' }}
              />
            ) : (
              <video autoPlay loop muted style={{ height: 300 }} controls>
                <source src={file} type="" />
              </video>
            )
          ) : null}
        </Box>
      </Paper>
      <FlexCenterBox>
        <LoadingButton
          loading={fetching ? fetching : false}
          loadingPosition="start"
          variant="outlined"
          startIcon={<CreateRoundedIcon />}
          type="submit"
          disabled={!formik.dirty || formik.isSubmitting || !formik.isValid}
          sx={{
            width: {
              xs: '30%',
              md: '20%',
            },
          }}
        >
          {t('post:create.post_')}
        </LoadingButton>
      </FlexCenterBox>
    </Box>
  );
}
