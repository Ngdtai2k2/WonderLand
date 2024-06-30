import React from 'react';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

import { BoxModal } from '../../components/styles';
import { payment } from '../../api/zalopay';
import useUserAxios from '../../hooks/useUserAxios';

export default function DonateModal({ open, handleClose, recipient }) {
  const { t, i18n } = useTranslation(['validate', 'field', 'message']);

  const { accessToken, axiosJWT, user } = useUserAxios(i18n.language);

  const validationSchema = Yup.object({
    amount: Yup.number().required(
      t('validate:required_field', { name: t('field:amount') }),
    ),
    message: Yup.string().required(
      t('validate:required_field', { name: t('field:description') }),
    ),
  });

  const formik = useFormik({
    initialValues: {
      amount: '',
      message: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      values.app_user = user?._id;
      values.recipient = recipient;
      const res = await payment(axiosJWT, accessToken, i18n.language, values);
      if (res.data.return_code === 1) {
        window.location.href = res.data.order_url;
      } else {
        toast.error(t('message:has_error'));
      }
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
        method="POST"
        width={{
          xs: '95%',
          sm: '70%',
          md: '50%',
        }}
        display="flex"
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
      >
        <Typography variant="h6" textAlign="center" fontWeight={600}>
          Donate
        </Typography>
        <TextField
          margin="normal"
          required
          fullWidth
          id="amount"
          name="amount"
          type="number"
          label={t('field:amount')}
          value={formik.values.amount}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.amount && Boolean(formik.errors.amount)}
          helperText={formik.touched.amount && formik.errors.amount}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          id="message"
          name="message"
          type="text"
          label={t('field:description')}
          value={formik.values.message}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.message && Boolean(formik.errors.message)}
          helperText={formik.touched.message && formik.errors.message}
        />
        <Button variant="contained" type="submit">
          Donate
        </Button>
      </BoxModal>
    </Modal>
  );
}
