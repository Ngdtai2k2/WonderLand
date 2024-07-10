import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';

import CustomBox from '../../../components/CustomBox';
import useUserAxios from '../../../hooks/useUserAxios';
import DataTable from '../../components/DataTable';

import {
  confirmWithdrawal,
  getAllTransactions,
} from '../../../api/transaction';
import { checkStatus } from '../../../api/zalopay';
import {
  COLORS,
  toastMapForZaloTransaction,
  useToastTheme,
} from '../../../constants/constant';
import {
  getQueryString,
  getStatusMessage,
  handleChangeTypeTransactions,
} from '../../../utils/helperFunction';
import { initializeSocket } from '../../../sockets/initializeSocket';

export default function Transaction() {
  const queryType = Number(getQueryString('type'));

  const [type, setType] = useState(
    queryType === 0 || queryType === 1 ? queryType : 0,
  );
  const [columns, setColumns] = useState([]);
  const [changes, setChanges] = useState();
  const [transactionState, setTransactionState] = useState({
    isLoading: false,
    data: [],
    total: 0,
    page: 1,
    pageSize: 5,
  });

  const toastTheme = useToastTheme();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation(['sidebar', 'transaction']);
  const { accessToken, axiosJWT, user } = useUserAxios(i18n.language);

  // socket
  const socket = initializeSocket(user?._id);
  socket.on('confirm-transaction', (data) => setChanges(data));

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
      type,
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
  }, [transactionState.page, transactionState.pageSize, type]);

  useEffect(() => {
    getTransactions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transactionState.page, transactionState.pageSize, type, changes]);

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

  const handleConfirmTransaction = async (transactionId, type) => {
    const response = await confirmWithdrawal(
      i18n.language,
      axiosJWT,
      accessToken,
      transactionId,
      type,
    );
    if (response.status === 200) {
      return toast.success(response.data.message, toastTheme);
    } else {
      return toast.error(response.data.message, toastTheme);
    }
  };

  useEffect(() => {
    // Define columns based on type and user
    const updatedColumns = [
      {
        field: 'transactionId',
        headerName: 'Transaction id',
        width: type === 0 ? 130 : 330,
      },
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
              {getStatusMessage(status, type)}
            </Typography>
          );
        },
      },
      {
        field: 'type',
        headerName: 'Type',
        width: 100,
        valueGetter: (values) => {
          return values === 0 ? 'Donate' : 'Withdrawal';
        },
      },
      {
        field: 'user',
        headerName: type === 0 ? 'Donors' : 'User',
        width: 100,
        renderCell: (params) => {
          const nickname = params?.row?.user?.nickname;
          return <Link href={`/u/${nickname}`}>{nickname}</Link>;
        },
      },
      type === 0 && {
        field: 'recipient',
        headerName: 'Recipient',
        width: 90,
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
        width: 200,
        renderCell: (params) => {
          const condition = params.row.type === 0 || params.row.status === 3;
          return (
            <Box display="flex" alignItems="center" marginTop={1} gap={1}>
              {condition && type === 1 && (
                <Button
                  variant="outlined"
                  color="success"
                  onClick={() =>
                    handleConfirmTransaction(params.row.transactionId, 1)
                  }
                >
                  Accept
                </Button>
              )}
              {type === 0 && (
                <Button
                  variant="outlined"
                  color="success"
                  onClick={() =>
                    checkStatusTransaction(params.row.transactionId)
                  }
                >
                  Check
                </Button>
              )}
              {type !== 0 && params.row.status === 3 && (
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() =>
                    handleConfirmTransaction(params.row.transactionId, 2)
                  }
                >
                  Reject
                </Button>
              )}
            </Box>
          );
        },
      },
    ].filter(Boolean);

    setColumns(updatedColumns);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, user]);

  return (
    <CustomBox>
      <Typography variant="h6" fontWeight={700}>
        {t('sidebar:transactions')}
      </Typography>

      <Box marginTop={2}>
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
        <DataTable
          state={transactionState}
          setState={setTransactionState}
          columns={columns}
        />
      </Box>
    </CustomBox>
  );
}
