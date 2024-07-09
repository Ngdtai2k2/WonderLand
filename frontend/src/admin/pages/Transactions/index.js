import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

import CustomBox from '../../../components/CustomBox';
import useUserAxios from '../../../hooks/useUserAxios';

import { getAllTransactions } from '../../../api/transaction';
import { checkStatus } from '../../../api/zalopay';
import {
  COLORS,
  toastMapForZaloTransaction,
  useToastTheme,
} from '../../../constants/constant';
import DataTable from '../../components/DataTable';

export default function Transaction() {
  const [transactionState, setTransactionState] = useState({
    isLoading: false,
    data: [],
    total: 0,
    page: 1,
    pageSize: 5,
  });

  const { t, i18n } = useTranslation(['sidebar']);
  const { accessToken, axiosJWT, user } = useUserAxios(i18n.language);
  const toastTheme = useToastTheme();

  useEffect(() => {
    document.title = t('sidebar:transactions');
  }, [t]);

  const getTransactions = useCallback(async () => {
    setTransactionState((old) => ({
      ...old,
      isLoading: true,
    }));

    const response = await getAllTransactions(
      i18n.language,
      axiosJWT,
      accessToken,
      transactionState.page,
      transactionState.pageSize,
    );

    setTransactionState((old) => ({
      ...old,
      isLoading: false,
      data: response?.data.results.docs,
      total: response?.data.results.totalDocs,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transactionState.page, transactionState.pageSize]);

  useEffect(() => {
    getTransactions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transactionState.page, transactionState.pageSize]);

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
    { field: 'transactionId', headerName: 'Transaction id', width: 130 },
    {
      field: 'amount',
      headerName: 'Amount',
      width: 150,
      type: 'number',
      renderCell: (params) => {
        const data = params.row;
        return (
          <Box marginTop={1.5}>
            {data.recipient._id === user?._id ? (
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
    // {
    //   field: 'updatedAt',
    //   headerName: 'Updated at',
    //   width: 200,
    //   valueGetter: (values) => {
    //     return new Date(values).toLocaleString();
    //   },
  ];

  return (
    <CustomBox>
      <Typography variant="h6" fontWeight={700}>
        {t('sidebar:transactions')}
      </Typography>

      <Box marginTop={2}>
        <DataTable
          state={transactionState}
          setState={setTransactionState}
          columns={columns}
        />
      </Box>
    </CustomBox>
  );
}
