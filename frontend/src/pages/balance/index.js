import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';

import CustomBox from '../../components/CustomBox';
import DataTable from '../../admin/components/DataTable';

import { getBalanceByUser } from '../../api/users';
import { checkStatus } from '../../api/zalopay';
import {
  COLORS,
  toastMapForZaloTransaction,
  useToastTheme,
} from '../../constants/constant';
import useUserAxios from '../../hooks/useUserAxios';
import ModalWithdraw from './modalWithdraw';
import {
  getQueryString,
  handleChangeTypeTransactions,
} from '../../utils/helperFunction';
import { getAllTransactionsOfUser } from '../../api/transaction';

export default function Balance() {
  const queryType = Number(getQueryString('type'));

  const [type, setType] = useState(
    queryType === 0 || queryType === 1 ? queryType : 0,
  );
  const [openModalWithdraw, setOpenModalWithdraw] = useState(false);
  const [balance, setBalance] = useState(null);
  const [columns, setColumns] = useState([]);
  const [eventChange, setEventChange] = useState();
  const [transactions, setTransactions] = useState({
    isLoading: false,
    data: [],
    total: 0,
    page: 1,
    pageSize: 5,
  });

  const navigate = useNavigate();
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

    const response = await getAllTransactionsOfUser(
      i18n.language,
      axiosJWT,
      accessToken,
      user?._id,
      type,
      transactions.page,
      transactions.pageSize,
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
  }, [transactions.page, transactions.pageSize, eventChange, type]);

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

  useEffect(() => {
    const updatedColumns = [
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
        headerName: type === 0 ? 'Donors' : 'User',
        width: 100,
        renderCell: (params) => {
          const nickname = params.row.user.nickname;
          return <Link href={`/u/${nickname}`}>{nickname}</Link>;
        },
      },
      type === 0 && {
        field: 'recipient',
        headerName: 'Recipient',
        width: 100,
        renderCell: (params) => {
          const nickname = params?.row?.recipient?.nickname;
          return <Link href={`/u/${nickname}`}>{nickname}</Link>;
        },
      },
      type !== 0 && {
        field: 'informationWithdraw',
        headerName: 'Information withdraw',
        width: 300,
      },
      {
        field: 'message',
        headerName: 'Message',
        width: 250,
      },
      {
        field: 'createdAt',
        headerName: 'Created at',
        width: 200,
        valueGetter: (values) => {
          return new Date(values).toLocaleString();
        },
      },
      type === 0 && {
        field: '',
        headerName: 'Actions',
        width: 120,
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
    ].filter(Boolean);

    setColumns(updatedColumns);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type]);

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
      <Typography variant="h6" fontWeight={600}>
        {t('transaction:history')}
      </Typography>
      <Box marginTop={1}>
        <RadioGroup
          aria-labelledby="radio-buttons-change-type-transactions"
          name="controlled-radio-buttons-group"
          value={type}
          onChange={(event) =>
            handleChangeTypeTransactions(event, setType, navigate)
          }
          sx={{ display: 'flex', flexDirection: 'row' }}
        >
          <FormControlLabel
            key={0}
            value={0}
            control={<Radio />}
            label={t('transaction:donate')}
          />
          <FormControlLabel
            key={1}
            value={1}
            control={<Radio />}
            label={t('transaction:withdrawal')}
          />
        </RadioGroup>
      </Box>
      <Box marginTop={2}>
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
