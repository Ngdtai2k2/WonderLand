import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import { useFormik } from 'formik';

import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import LoadingButton from '@mui/lab/LoadingButton';

import { BoxModal } from '../styles';
import { useToastTheme, BaseApi } from '../../../constants/constant';
import useUserAxios from '../../../hooks/useUserAxios';

export default function ModalRuleForm({
  openModal,
  handleClose,
  isUpdate,
  data,
}) {
  const [fetching, setFetching] = useState(false);

  const toastTheme = useToastTheme();
  const { t, i18n } = useTranslation(['admin', 'validate', 'field']);
  const { accessToken, axiosJWT } = useUserAxios(i18n.language);

  useEffect(() => {
    if (isUpdate && data) {
      formik.setValues({
        name: data.name || '',
        description: data.description || '',
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isUpdate, data]);

  const validationSchema = Yup.object({
    name: Yup.string()
      .required(t('validate:required_field', { name: t('field:name') }))
      .min(1, t('validate:min', { name: t('field:name'), min: '1' }))
      .max(100, t('validate:max', { name: t('field:name'), max: '100' })),
    description: Yup.string()
      .required(t('validate:required_field', { name: t('field:description') }))
      .min(1, t('validate:min', { name: t('field:description'), min: '1' }))
      .max(
        3000,
        t('validate:max', { name: t('field:description'), max: '3000' }),
      ),
  });

  const formik = useFormik({
    initialValues: {
      name: '',
      description: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        setFetching(true);
        const response = await (isUpdate
          ? axiosJWT.put(
              `${BaseApi}/rule/update/${data?._id}`,
              {
                name: values.name.trim(),
                description: values.description.trim(),
              },
              {
                headers: { token: `Bearer ${accessToken}` },
              },
            )
          : axiosJWT.post(
              `${BaseApi}/rule/create`,
              {
                name: values.name,
                description: values.description,
              },
              {
                headers: { token: `Bearer ${accessToken}` },
              },
            ));
        if (!isUpdate) {
          formik.resetForm();
        }
        return toast.success(response.data.message, toastTheme);
      } catch (error) {
        return toast.error(error.response.data.message, toastTheme);
      } finally {
        setFetching(false);
      }
    },
  });

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
          sm: '70%',
          md: '45%',
        }}
      >
        <Typography variant="h6">
          {isUpdate ? t('admin:update') : t('admin:add')}{' '}
          <span style={{ textTransform: 'lowercase' }}>{t('field:rule')}</span>
        </Typography>
        <TextField
          margin="normal"
          required
          id="name-rule"
          label={t('field:name')}
          name="name"
          autoComplete="name"
          value={formik.values.name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.name && Boolean(formik.errors.name)}
          helperText={formik.touched.name && formik.errors.name}
          fullWidth
          size="small"
          variant="outlined"
        />
        <TextField
          margin="normal"
          required
          id="description-rule"
          label={t('field:description')}
          name="description"
          autoComplete="description"
          multiline
          rows={4}
          value={formik.values.description}
          onBlur={formik.handleBlur}
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
          error={
            formik.touched.description && Boolean(formik.errors.description)
          }
          helperText={formik.touched.description && formik.errors.description}
          fullWidth
          size="small"
          variant="outlined"
        />
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
