import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Badge from '@mui/material/Badge';
import LoadingButton from '@mui/lab/LoadingButton';

import { BaseApi, useToastTheme } from '../../../constants/constant';
import useUserAxios from '../../../hooks/useUserAxios';

import { ImageStyle } from './styles';
import { BoxModal } from '../styles';

export default function ModalCategoryForm({
  openModal,
  handleClose,
  isUpdate,
  data,
}) {
  const [file, setFile] = useState();
  const [fetching, setFetching] = useState();

  const toastTheme = useToastTheme();
  const { t, i18n } = useTranslation(['validate', 'field', 'admin']);

  const { accessToken, axiosJWT } = useUserAxios(i18n.language);

  useEffect(() => {
    if (isUpdate && data) {
      formik.setValues({
        name: data.name || '',
        description: data.description || '',
        file: '',
      });
      if (data.media && data.media.url) {
        setFile(data.media.url);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isUpdate, data]);

  const fileValidation = Yup.mixed().test(
    'fileType',
    t('validate:file.not_support'),
    (value) => {
      if (!value) return true;
      const imageTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];
      return value && imageTypes.includes(value.type);
    },
  );

  const validationSchema = Yup.object({
    name: Yup.string().required(
      t('validate:required_field', { name: t('field:name') }),
    ),
    description: Yup.string()
      .required(t('validate:required_field', { name: t('field:description') }))
      .max(
        2000,
        t('validate:max', { name: t('field:description'), max: '2000' }),
      ),
    file: isUpdate
      ? fileValidation
      : fileValidation.required(t('validate:photo_required')),
  });

  const formik = useFormik({
    initialValues: {
      name: '',
      description: '',
      file: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        setFetching(true);
        const formData = new FormData();

        formData.append('name', values.name.trim());
        formData.append('description', values.description.trim());
        formData.append('file', values.file);

        const response = await (isUpdate
          ? axiosJWT.put(`${BaseApi}/category/update/${data?._id}`, formData, {
              headers: {
                token: `Bearer ${accessToken}`,
                'Accept-Language': i18n.language,
              },
            })
          : axiosJWT.post(`${BaseApi}/category/create`, formData, {
              headers: {
                token: `Bearer ${accessToken}`,
                'Accept-Language': i18n.language,
              },
            }));

        if (!isUpdate) {
          formik.resetForm();
          handleClearFile();
        }
        return toast.success(response.data.message, toastTheme);
      } catch (error) {
        return toast.error(error.response.data.message, toastTheme);
      } finally {
        setFetching(false);
      }
    },
  });

  const handleClearFile = () => {
    setFile(null);
    document.getElementById('file').value = '';
    formik.setFieldValue('file', null);
  };

  return (
    <Modal open={openModal} onClose={handleClose}>
      <BoxModal
        component="form"
        noValidate
        onSubmit={formik.handleSubmit}
        method="POST"
        bgcolor="background.paper"
        width={{
          xs: '95%',
          sm: '75%',
          md: '50%',
        }}
      >
        <Typography variant="h6">
          {isUpdate ? t('admin:update') : t('admin:add')}{' '}
          <span style={{ textTransform: 'lowercase' }}>
            {t('field:category')}
          </span>
        </Typography>
        <TextField
          margin="normal"
          size="small"
          required
          fullWidth
          id="name"
          label={t('field:name')}
          name="name"
          autoComplete="name"
          value={formik.values.name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.name && Boolean(formik.errors.name)}
          helperText={formik.touched.name && formik.errors.name}
        />
        <TextField
          margin="normal"
          size="small"
          required
          fullWidth
          id="description"
          label={t('field:description')}
          name="description"
          autoComplete="description"
          value={formik.values.description}
          onChange={(e) => {
            if (e.keyCode === 13 && e.shiftKey) {
              e.preventDefault();
              formik.setFieldValue(
                'description',
                `${formik.values.description}\n` +
                  e.target.value.substring(
                    e.target.selectionStart,
                    e.target.selectionEnd,
                  ),
              );
            } else {
              formik.handleChange(e);
            }
          }}
          onBlur={formik.handleBlur}
          error={
            formik.touched.description && Boolean(formik.errors.description)
          }
          helperText={formik.touched.description && formik.errors.description}
        />
        <Box display="flex" flexDirection="column" marginTop={2}>
          <Box>
            <input
              type="file"
              id="file"
              name="file"
              accept="image/jpeg,image/png,image/jpg,image/gif"
              onBlur={formik.handleBlur}
              onChange={(event) => {
                const files = event.currentTarget.files[0];
                formik.setFieldValue('file', files);
                URL.revokeObjectURL(files);
                setFile(URL.createObjectURL(files));
              }}
            />
          </Box>

          {formik.touched.file && formik.errors.file && (
            <Typography variant="caption" color="error">
              {formik.errors.file}
            </Typography>
          )}
          <Typography variant="caption" marginTop={0.5}>
            {t('validate:file.support_max_size')}
          </Typography>
          {file && (
            <Box marginTop={2}>
              <Badge
                badgeContent="x"
                color="error"
                onClick={() => handleClearFile()}
                sx={{ cursor: 'pointer' }}
              >
                <ImageStyle src={file} alt="Preview image upload" />
              </Badge>
            </Box>
          )}
        </Box>
        <Box display="flex" justifyContent="center" marginTop={3}>
          <LoadingButton
            loading={fetching ? fetching : false}
            variant="outlined"
            type="submit"
            disabled={!formik.dirty || formik.isSubmitting || !formik.isValid}
          >
            {t('admin:save')}
          </LoadingButton>
        </Box>
      </BoxModal>
    </Modal>
  );
}
