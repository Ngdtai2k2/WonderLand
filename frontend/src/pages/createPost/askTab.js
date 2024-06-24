import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import LoadingButton from '@mui/lab/LoadingButton';

import CreateRoundedIcon from '@mui/icons-material/CreateRounded';

import LoadingCircularIndeterminate from '../../components/Loading';

import { API } from '../../api/base';
import { useToastTheme } from '../../constants/constant';
import useUserAxios from '../../hooks/useUserAxios';

import { FlexCenterBox } from './styles';

export default function AskTab() {
  const [category, setCategory] = useState(null);
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
    content: Yup.string().max(
      1500,
      t('validate:max', { name: t('field:content'), max: '1500' }),
    ),
  });

  const formik = useFormik({
    initialValues: { category: '', title: '', content: '' },
    validationSchema,
    onSubmit: async (values) => {
      try {
        setFetching(true);
        const askData = {
          ...values,
          author: user?._id,
          type: 1,
        };

        const response = await axiosJWT.post(API.POST.CREATE, askData, {
          headers: { token: `Bearer ${accessToken}` },
        });
        toast.success(response.data.message, toastTheme);
        navigate('/');
      } catch (error) {
        toast.error(error.message, toastTheme);
      } finally {
        setFetching(false);
      }
    },
  });

  return loading ? (
    <LoadingCircularIndeterminate />
  ) : (
    <Box
      component="form"
      noValidate
      method="POST"
      display="flex"
      onSubmit={formik.handleSubmit}
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
        label={t('field:title')}
        type="text"
        value={formik.values.title}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.title && Boolean(formik.errors.title)}
        helperText={formik.touched.title && formik.errors.title}
      />
      <TextField
        multiline
        rows={4}
        margin="normal"
        id="content"
        label={t('field:content')}
        type="text"
        value={formik.values.content}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.content && Boolean(formik.errors.content)}
        helperText={formik.touched.content && formik.errors.content}
      />
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
