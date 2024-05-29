import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import dayjs from 'dayjs';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateField } from '@mui/x-date-pickers/DateField';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';

import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';

import { createAxios } from '../../createInstance';
import { loginSuccess } from '../../redux/slice/userSlice';
import { ShortenContent } from '../../utils/helperFunction';
import { updateUser } from '../../redux/apiRequest/userApi';
import { VisuallyHiddenInput } from '../styles';

export default function Profile() {
  const [filename, setFilename] = useState('');
  const [image, setImage] = useState();
  const [fetching, setFetching] = useState();

  const dispatch = useDispatch();
  const { t } = useTranslation(['validate', 'field', 'settings']);
  const user = useSelector((state) => state.auth.login?.currentUser);
  const accessToken = user?.accessToken;

  let axiosJWT = createAxios(user, dispatch, loginSuccess);

  const validationSchema = Yup.object({
    fullname: Yup.string()
      .required(t('validate:required_field', { name: t('field:fullname') }))
      .matches(
        /^[^\d]+$/,
        t('validate:matches_not_contain_digits', { name: t('field:fullname') }),
      ),
    phone: Yup.string(),
    about: Yup.string(),
    hometown: Yup.string(),
    birthDate: Yup.date(),
    image: Yup.mixed().test(
      'fileType',
      t('validate:file.not_support'),
      (value) => {
        if (!value) return true;
        return (
          value &&
          ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'].includes(
            value.type,
          )
        );
      },
    ),
  });

  const formik = useFormik({
    initialValues: {
      fullname: user?.fullname || '',
      phone: user?.phone || '',
      about: user?.about || '',
      gender: user?.gender || '',
      hometown: user?.hometown || '',
      birthday: user?.birthday ? dayjs(user?.birthday) : null,
      image: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setFetching(true);
      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        if (value !== null && key !== 'image') {
          formData.append(key, value);
        }
      });
      formData.append('file', values.image);
      await updateUser(accessToken, dispatch, user?._id, axiosJWT, formData);
      setFetching(false);
    },
  });

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box
        component="form"
        noValidate
        onSubmit={formik.handleSubmit}
        method="PUT"
      >
        <Typography variant="h5" fontWeight={700}>
          {t('settings:profile')}
        </Typography>
        <Box marginTop={2} display="flex" flexDirection="column">
          <Box display="flex" alignItems="center" gap={2} marginBottom={2}>
            <Avatar
              alt={'Avatar of ' + user?.fullname}
              src={image ? image : user?.media?.url}
              sx={{ width: 80, height: 80 }}
            />
            <Box display="flex" flexDirection="column">
              <Button
                component="label"
                role={undefined}
                variant="outlined"
                size="small"
                tabIndex={-1}
                startIcon={<CloudUploadIcon />}
                sx={{
                  textTransform: 'none',
                }}
              >
                <VisuallyHiddenInput
                  type="file"
                  id="image"
                  name="image"
                  accept="image/*"
                  onBlur={formik.handleBlur}
                  onChange={(event) => {
                    formik.setFieldValue('image', event.currentTarget.files[0]);
                    setFilename(event.currentTarget.files[0].name);
                    setImage(URL.createObjectURL(event.currentTarget.files[0]));
                  }}
                />
                {filename
                  ? ShortenContent(filename, 30)
                  : t('settings:upload_image')}
              </Button>
              <Typography variant="caption" marginTop={0.5}>
                {t('validate:file.support_max_size')}
              </Typography>
              {formik.touched.image && formik.errors.image && (
                <Typography variant="caption" color="error">
                  {formik.errors.image}
                </Typography>
              )}
            </Box>
          </Box>
          <TextField
            margin="normal"
            required
            fullWidth
            id="fullname"
            label={t('field:fullname')}
            type="text"
            size="small"
            value={formik.values.fullname}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.fullname && Boolean(formik.errors.fullname)}
            helperText={formik.touched.fullname && formik.errors.fullname}
          />
          <DateField
            size="small"
            label={t('field:birthday')}
            sx={{ marginY: 1 }}
            value={formik.values.birthday}
            onChange={(date) => formik.setFieldValue('birthday', date)}
            helperText={formik.touched.birthday && formik.errors.birthday}
            onBlur={formik.handleBlur}
            error={formik.touched.birthday && Boolean(formik.errors.birthday)}
          />
          <TextField
            margin="normal"
            fullWidth
            id="phone"
            label={t('field:phone')}
            type="text"
            size="small"
            value={formik.values.phone}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.phone && Boolean(formik.errors.phone)}
            helperText={formik.touched.phone && formik.errors.phone}
          />
          <TextField
            margin="normal"
            fullWidth
            multiline
            rows={4}
            id="about"
            label={t('field:about')}
            type="text"
            value={formik.values.about}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.about && Boolean(formik.errors.about)}
            helperText={formik.touched.about && formik.errors.about}
          />
          <TextField
            margin="normal"
            id="gender"
            select
            label={t('field:gender.gender')}
            name="gender"
            size="small"
            value={formik.values.gender}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.gender && Boolean(formik.errors.gender)}
            helperText={formik.touched.gender && formik.errors.gender}
          >
            <MenuItem value={0}>{t('field:gender.male')}</MenuItem>
            <MenuItem value={1}>{t('field:gender.female')}</MenuItem>
            <MenuItem value={2}>{t('field:gender.other')}</MenuItem>
          </TextField>
          <TextField
            margin="normal"
            fullWidth
            id="hometown"
            label={t('field:hometown')}
            type="hometown"
            size="small"
            value={formik.values.hometown}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.hometown && Boolean(formik.errors.hometown)}
            helperText={formik.touched.hometown && formik.errors.hometown}
          />
        </Box>
        <LoadingButton
          loading={fetching ? fetching : false}
          loadingPosition="start"
          variant="outlined"
          type="submit"
          startIcon={<SaveRoundedIcon />}
          disabled={!formik.dirty || formik.isSubmitting || !formik.isValid}
          sx={{
            marginTop: 2,
          }}
        >
          {t('settings:save')}
        </LoadingButton>
      </Box>
    </LocalizationProvider>
  );
}
