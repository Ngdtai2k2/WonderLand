import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';

import CustomBox from '../../components/CustomBox';
import DataTable from '../../admin/components/DataTable';

import { API } from '../../api/base';
import { getBalanceByUser } from '../../api/users';
import { checkStatus } from '../../api/zalopay';
import {
  COLORS,
  toastMapForZaloTransaction,
  useToastTheme,
} from '../../constants/constant';
import useUserAxios from '../../hooks/useUserAxios';
import ModalWithdraw from './modalWithdraw';

export default function Balance() {
  const [openModalWithdraw, setOpenModalWithdraw] = useState(false);
  const [balance, setBalance] = useState(null);
  const [eventChange, setEventChange] = useState();
  const [transactions, setTransactions] = useState({
    isLoading: false,
    data: [],
    total: 0,
    page: 1,
    pageSize: 5,
  });

  const { t, i18n } = useTranslation(['transaction']);
  const { user, accessToken, axiosJWT } = useUserAxios(i18n.language);
  const toastTheme = useToastTheme();

  useEffect(() => {
    document.title = t('transaction:your_balance');
  }, [t]);

  const getBalance = async () => {
    const res = await getBalanceByUser(
      i18n.language,
      user?._id,
      axiosJWT,
      accessToken,
    );
    setBalance(res);
  };

  const getAllTransactionByUserId = async () => {
    setTransactions({
      ...transactions,
      isLoading: true,
    });
    const response = await axiosJWT.get(
      `${API.TRANSACTION.GET_ALL_OF_USER(user?._id)}&_page=${transactions.page}&_limit=${transactions.pageSize}`,
      {
        headers: {
          token: `Bearer ${accessToken}`,
        },
      },
    );
    setTransactions((old) => ({
      ...old,
      isLoading: false,
      data: response?.data?.results?.docs,
      total: response?.data?.results?.totalDocs,
    }));
  };

  useEffect(() => {
    getBalance();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventChange]);

  useEffect(() => {
    getAllTransactionByUserId();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transactions.page, transactions.pageSize, eventChange]);

  const checkStatusTransaction = async (transactionId) => {
    const response = await checkStatus(
      transactionId,
      axiosJWT,
      accessToken,
      i18n.language,
    );

    if (response.status === 200) {
      const showToast =
        toastMapForZaloTransaction[response.data.result.return_code] ||
        toastMapForZaloTransaction.default;
      return showToast(response.data.message, toastTheme);
    } else {
      return toast.error(response.data.message, toastTheme);
    }
  };

  const columns = [
    { field: 'transactionId', headerName: 'Transaction id', width: 150 },
    {
      field: 'amount',
      headerName: 'Amount',
      width: 150,
      type: 'number',
      renderCell: (params) => {
        const data = params.row;
        return (
          <Box marginTop={1.5}>
            {data?.recipient?._id === user?._id ? (
              <Typography color={COLORS.success}>+ {data.amount}</Typography>
            ) : (
              <Typography color={COLORS.error}>- {data.amount}</Typography>
            )}
          </Box>
        );
      },
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 100,
      renderCell: (params) => {
        const status = params.row.status;
        return (
          <Typography
            color={
              status === 1
                ? COLORS.success
                : status === 2
                  ? COLORS.error
                  : COLORS.warning
            }
            marginTop={1.5}
          >
            {status === 1 ? 'Success' : status === 2 ? 'Failed' : 'Pending'}
          </Typography>
        );
      },
    },
    {
      field: 'type',
      headerName: 'Type',
      width: 100,
      valueGetter: (values) => {
        return values === 0 ? 'Donate' : 'Withdraw';
      },
    },
    {
      field: 'user',
      headerName: 'Donors',
      width: 100,
      renderCell: (params) => {
        const nickname = params.row.user.nickname;
        return <Link href={`/u/${nickname}`}>{nickname}</Link>;
      },
    },
    {
      field: 'recipient',
      headerName: 'Recipient',
      width: 100,
      renderCell: (params) => {
        const nickname = params.row.recipient.nickname;
        return <Link href={`/u/${nickname}`}>{nickname}</Link>;
      },
    },
    {
      field: 'createdAt',
      headerName: 'Created at',
      width: 200,
      valueGetter: (values) => {
        return new Date(values).toLocaleString();
      },
    },
    {
      field: '',
      headerName: 'Actions',
      width: 100,
      renderCell: (params) => {
        return (
          params.row.type === 0 && (
            <Box display="flex" gap={1}>
              <Box>
                <Button
                  variant="outlined"
                  color="success"
                  onClick={() =>
                    checkStatusTransaction(params.row.transactionId)
                  }
                >
                  Check
                </Button>
              </Box>
            </Box>
          )
        );
      },
    },
  ];

  return (
    <CustomBox>
      <Box
        display="flex"
        justifyContent={{
          xs: 'flex-start',
          sm: 'space-between',
        }}
        flexDirection={{
          xs: 'column',
          sm: 'row',
        }}
      >
        <Typography variant="h6" fontWeight={700}>
          {t('transaction:your_balance')}:{' '}
          {balance !== null ? balance.toLocaleString() : '---'}đ
        </Typography>
        {balance !== null && (
          <>
            <Button
              variant="contained"
              sx={{ marginY: 2 }}
              onClick={() => setOpenModalWithdraw(true)}
            >
              {t('transaction:withdrawal')}
            </Button>
            <ModalWithdraw
              openModal={openModalWithdraw}
              handleClose={() => setOpenModalWithdraw(false)}
              currentBalance={balance}
              setEventChange={setEventChange}
            />
          </>
        )}
      </Box>
      <Box marginTop={5}>
        <Typography variant="body1" marginBottom={1} fontWeight={600}>
          {t('transaction:history')}
        </Typography>
        <Divider />
        <DataTable
          state={transactions}
          setState={setTransactions}
          columns={columns}
        />
      </Box>
    </CustomBox>
  );
}
