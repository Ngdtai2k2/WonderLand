import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';

import LoadingCircularIndeterminate from '../../components/Loading';
import CustomBox from '../../components/CustomBox';
import useUserAxios from '../../hooks/useUserAxios';
import { checkStatus } from '../../api/zalopay';

import successfully_transaction from '../../assets/svg/successful_transaction.svg';
import pending_transaction from '../../assets/svg/pending.svg';
import fail_transaction from '../../assets/svg/fail_transaction.svg';

export default function Result() {
  const [data, setData] = useState();

  const location = useLocation();

  const { i18n } = useTranslation();

  const { accessToken, axiosJWT } = useUserAxios(i18n.language);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const transactionId = searchParams.get('apptransid');

    const checkStatusTransaction = async (transactionId) => {
      const res = await checkStatus(
        transactionId,
        axiosJWT,
        accessToken,
        i18n.language,
      );
      setData(res.data);
    };
    checkStatusTransaction(transactionId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

  return (
    <CustomBox>
      {data ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          flexDirection="column"
        >
          <Avatar
            src={
              data?.result.return_code === 1
                ? successfully_transaction
                : data?.result.return_code === 3
                  ? pending_transaction
                  : fail_transaction
            }
            sx={{
              width: {
                xs: '90%',
                sm: '75%',
                md: '25%',
              },
              height: 'auto',
            }}
            variant="square"
          />
          <Typography variant="h4" fontWeight={700} textAlign="center">
            {data?.message}
          </Typography>
          <Link href="/" marginTop={1}>
            Back to home
          </Link>
        </Box>
      ) : (
        <LoadingCircularIndeterminate />
      )}
    </CustomBox>
  );
}
