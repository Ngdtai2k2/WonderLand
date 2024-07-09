import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useFormik } from 'formik';
import axios from 'axios';
import * as Yup from 'yup';

import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Modal from '@mui/material/Modal';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

import { BoxModal } from '../styles';
import { useTranslation } from 'react-i18next';
import useUserAxios from '../../hooks/useUserAxios';
import { useToastTheme } from '../../constants/constant';
import { handleWithdrawal } from '../../api/transaction';

export default function ModalWithdraw({
  openModal,
  handleClose,
  currentBalance,
  setEventChange,
}) {
  const [bankList, setBankList] = useState();
  const { t, i18n } = useTranslation(['transaction', 'validate']);
  const { user, accessToken, axiosJWT } = useUserAxios(i18n.language);
  const toastTheme = useToastTheme();

  const validationSchema = Yup.object({
    amount: Yup.number()
      .required(t('validate:required_field', { name: t('field:amount') }))
      .min(20000, t('validate:min_amount', { min: 20000 }))
      .max(currentBalance, t('validate:not_greater_than_balance')),
    bankName: Yup.string().required(
      t('validate:required_field', { name: t('field:bank_name') }),
    ),
    bankAccount: Yup.string().required(
      t('validate:required_field', { name: t('field:bank_account') }),
    ),
    bankAccountHolder: Yup.string().required(
      t('validate:required_field', { name: t('field:bank_account_holder') }),
    ),
    bankMessage: Yup.string(),
  });

  const formik = useFormik({
    initialValues: {
      amount: '',
      bankName: '',
      bankAccount: '',
      bankMessage: '',
      bankAccountHolder: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      let data = {};

      data.informationWithdraw = `${values.bankName} - ${values.bankAccount} - ${values.bankAccountHolder}`;
      data.amount = values.amount;

      const response = await handleWithdrawal(
        i18n.language,
        axiosJWT,
        accessToken,
        user._id,
        data,
      );

      if (response.status === 200 || response.status === 201) {
        setEventChange(response.data.transaction._id);
        toast.success(response.data.message, toastTheme);
        handleClose();
      } else {
        toast.error(response.data.message, toastTheme);
      }
    },
  });

  const getBankList = async () => {
    try {
      const response = await axios.get(process.env.REACT_APP_API_BANK);
      setBankList(response.data.data);
    } catch (error) {
      setBankList([]);
    }
  };

  useEffect(() => {
    getBankList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Modal open={openModal} onClose={handleClose}>
      <BoxModal
        noValidate
        bgcolor="background.paper"
        width={{
          xs: '95%',
          sm: '75%',
          md: '50%',
        }}
        display="flex"
        flexDirection="column"
        component="form"
        onSubmit={formik.handleSubmit}
      >
        <Typography variant="h6" textAlign="center">
          {t('transaction:withdrawal')}
        </Typography>
        <TextField
          margin="normal"
          size="small"
          required
          id="amount"
          name="amount"
          type="number"
          label={t('field:amount')}
          value={formik.values.amount}
          onChange={formik.handleChange}
          error={formik.touched.amount && Boolean(formik.errors.amount)}
          helperText={formik.touched.amount && formik.errors.amount}
          onBlur={formik.handleBlur}
        />
        <Typography variant="caption" fontStyle="italic" marginLeft={1}>
          {t('field:fee')}: 3%
        </Typography>
        <TextField
          margin="normal"
          size="small"
          required
          select
          id="bankName"
          name="bankName"
          label={t('field:bank_name')}
          value={formik.values.bankName}
          onChange={formik.handleChange}
          error={formik.touched.bankName && Boolean(formik.errors.bankName)}
          helperText={formik.touched.bankName && formik.errors.bankName}
          onBlur={formik.handleBlur}
        >
          {bankList &&
            bankList.map((bank) => (
              <MenuItem key={bank.id} value={bank.shortName}>
                <Box display="flex" alignItems="center">
                  <Avatar
                    src={bank.logo}
                    variant="square"
                    sx={{
                      width: 'auto',
                      height: 32,
                      borderRadius: '5px',
                      objectFit: 'contain',
                      backgroundColor: '#fff',
                    }}
                  />
                  <Typography variant="body1" marginX={1}>
                    {bank.shortName} ({bank.code})
                  </Typography>
                </Box>
              </MenuItem>
            ))}
        </TextField>
        <TextField
          margin="normal"
          size="small"
          required
          id="bankAccount"
          name="bankAccount"
          label={t('field:bank_account')}
          type="text"
          value={formik.values.bankAccount}
          onChange={formik.handleChange}
          error={
            formik.touched.bankAccount && Boolean(formik.errors.bankAccount)
          }
          helperText={formik.touched.bankAccount && formik.errors.bankAccount}
          onBlur={formik.handleBlur}
        />
        <TextField
          margin="normal"
          size="small"
          required
          id="bankAccountHolder"
          name="bankAccountHolder"
          label={t('field:bank_account_holder')}
          type="text"
          value={formik.values.bankAccountHolder}
          onChange={formik.handleChange}
          error={
            formik.touched.bankAccountHolder &&
            Boolean(formik.errors.bankAccountHolder)
          }
          helperText={
            formik.touched.bankAccountHolder && formik.errors.bankAccountHolder
          }
          onBlur={formik.handleBlur}
        />
        <TextField
          margin="normal"
          size="small"
          id="bankMessage"
          name="bankMessage"
          type="text"
          label={t('field:bank_message')}
          value={formik.values.bankMessage}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{ marginTop: 3 }}
        >
          {t('transaction:withdrawal')}
        </Button>
      </BoxModal>
    </Modal>
  );
}
