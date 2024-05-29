import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import LoadingButton from '@mui/lab/LoadingButton';

import { useToastTheme, BaseApi } from '../../constants/constant';
import { BoxModal } from '../styles';
import Rules from '../Rules';
import useUserAxios from '../../hooks/useUserAxios';

export default function ModalReportForm({ open, handleClose, id }) {
  const [fetching, setFetching] = useState();
  const [selectRule, setSelectRule] = useState();

  const { t } = useTranslation(['field']);
  const toastTheme = useToastTheme();
  const { user, accessToken, axiosJWT } = useUserAxios();

  const formik = useFormik({
    initialValues: {
      reason: '',
    },
    validationSchema: Yup.object({
      reason: Yup.string(),
    }),
    onSubmit: async (values) => {
      try {
        setFetching(true);
        const response = await axiosJWT.post(
          `${BaseApi}/report/create?_report=post`,
          {
            id: id,
            reason: values.reason,
            rule: selectRule,
            userId: user._id,
          },
          {
            headers: {
              token: `Bearer ${accessToken}`,
            },
          },
        );
        toast.success(response?.data?.message, toastTheme);
      } catch (error) {
        toast.error(error.response?.data?.message, toastTheme);
      } finally {
        handleClose();
        setFetching(false);
      }
    },
  });

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-report-form"
      aria-describedby="modal-report-form-description"
    >
      <BoxModal
        bgcolor="background.paper"
        width={{
          xs: '95%',
          sm: '70%',
          md: '50%',
        }}
        component="form"
        noValidate
        method="POST"
        onSubmit={formik.handleSubmit}
      >
        <Typography
          id="modal-modal-title"
          variant="h6"
          component="h2"
          textAlign="center"
          fontWeight={700}
          marginBottom={2}
        >
          {t('field:report')}
        </Typography>
        <Rules isReport={true} setState={setSelectRule} />
        <TextField
          margin="normal"
          size="small"
          fullWidth
          id="reason"
          label={`${t('field:reason')} (${t('field:optional')})`}
          name="reason"
          autoComplete="reason"
          value={formik.values.reason}
          onChange={formik.handleChange}
          error={formik.touched.reason && Boolean(formik.errors.reason)}
          helperText={formik.touched.reason && formik.errors.reason}
          sx={{
            marginTop: 5,
          }}
        />
        <Box display="flex" justifyContent="center" marginTop={1}>
          <LoadingButton
            loading={fetching ? fetching : false}
            variant="outlined"
            type="submit"
            disabled={formik.isSubmitting || !formik.isValid}
            sx={{
              width: {
                xs: '30%',
                md: '20%',
              },
            }}
          >
            {t('field:report')}
          </LoadingButton>
        </Box>
      </BoxModal>
    </Modal>
  );
}
