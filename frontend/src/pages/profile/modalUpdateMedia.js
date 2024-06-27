import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import LazyLoad from 'react-lazyload';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import Grid from '@mui/material/Grid';

import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';

import { BoxModal } from '../../components/styles';
import useUserAxios from '../../hooks/useUserAxios';
import { createAxios } from '../../createInstance';
import { loginSuccess } from '../../redux/slice/userSlice';
import { updateMedia } from '../../redux/apiRequest/userApi';
import { useToastTheme } from '../../constants/constant';
import { ShortenContent } from '../../utils/helperFunction';
import { VisuallyHiddenInput } from '../styles';

export default function ModalUpdateMedia({
  open,
  handleClose,
  type,
  setEvent,
}) {
  const [filename, setFilename] = useState('');
  const [image, setImage] = useState();
  const [fetching, setFetching] = useState();

  const dispatch = useDispatch();
  const toastTheme = useToastTheme();
  const { t, i18n } = useTranslation(['validate', 'settings']);
  const { user, accessToken } = useUserAxios(i18n.language);

  let axiosJWT = createAxios(i18n.language, user, dispatch, loginSuccess);

  const validationSchema = Yup.object({
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
      image: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      setFetching(true);
      const formData = new FormData();
      formData.append('type', type);
      formData.append('file', values.image);

      const res = await updateMedia(
        i18n.language,
        accessToken,
        dispatch,
        user._id,
        axiosJWT,
        formData,
        toastTheme,
      );

      setEvent(type === 1 ? res?.coverArt?._id : res?.media?._id);
      setFetching(false);
      handleClose();
    },
  });
  return (
    <Modal open={open} onClose={handleClose}>
      <BoxModal
        bgcolor="background.paper"
        component="form"
        noValidate
        onSubmit={formik.handleSubmit}
        method="PUT"
        width={{
          xs: '95%',
          sm: '70%',
          md: '50%',
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={5}>
            <LazyLoad height="auto" once>
              <Avatar
                alt={
                  type === 1
                    ? `Cover art of ${user?.fullname}`
                    : `Avatar of ${user?.fullname}`
                }
                src={
                  image
                    ? image
                    : type === 1
                      ? user?.coverArt?.url
                      : user?.media?.url
                }
                variant="square"
                sx={{ width: '100%', height: 'auto', borderRadius: '5px' }}
              />
            </LazyLoad>
          </Grid>
          <Grid
            item
            xs={7}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
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
              <LoadingButton
                loading={fetching ? fetching : false}
                loadingPosition="start"
                variant="outlined"
                type="submit"
                startIcon={<SaveRoundedIcon />}
                disabled={
                  !formik.dirty || formik.isSubmitting || !formik.isValid
                }
                sx={{
                  marginTop: 3,
                }}
              >
                {t('settings:save')}
              </LoadingButton>
            </Box>
          </Grid>
        </Grid>
      </BoxModal>
    </Modal>
  );
}
