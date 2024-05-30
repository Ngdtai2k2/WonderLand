import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';

import SupervisedUserCircleRoundedIcon from '@mui/icons-material/SupervisedUserCircleRounded';
import GroupAddRoundedIcon from '@mui/icons-material/GroupAddRounded';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import VisibilityOffRoundedIcon from '@mui/icons-material/VisibilityOffRounded';

import DataTable from '../../components/DataTable';
import CustomBox from '../../../components/CustomBox';

import { BaseApi } from '../../../constants/constant';
import { convertNumber } from '../../../utils/helperFunction';
import { BoxContainer, BoxIcon, BoxItems } from './styles';
import useUserAxios from '../../../hooks/useUserAxios';

export default function Dashboard() {
  const [totalUsers, setTotalUsers] = useState(NaN);
  const [openCollapse, setOpenCollapse] = useState({
    0: false,
    1: false,
    2: false,
  });
  const [newUsersState, setNewUsersState] = useState({
    isLoading: false,
    data: [],
    total: 0,
    page: 1,
    pageSize: 5,
  });
  const [usersState, setUsersState] = useState({
    isLoading: false,
    data: [],
    total: 0,
    page: 1,
    pageSize: 5,
  });

  const { t } = useTranslation(['admin']);
  const { accessToken, axiosJWT } = useUserAxios();

  useEffect(() => {
    document.title = 'Admin - Dashboard';
  });

  useEffect(() => {
    async function getTotalUsers() {
      try {
        const response = await axiosJWT.post(
          `${BaseApi}/user/total`,
          {},
          {
            headers: {
              token: `Bearer ${accessToken}`,
            },
          },
        );
        setTotalUsers(response.data.total);
      } catch (error) {
        setTotalUsers(NaN);
      }
    }
    getTotalUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getNewUsers = async () => {
    setNewUsersState((old) => ({ ...old, isLoading: true }));
    const response = await axiosJWT.post(
      `${BaseApi}/user/today?_page=${newUsersState.page}&_limit=${newUsersState.pageSize}`,
      {},
      {
        headers: {
          token: `Bearer ${accessToken}`,
        },
      },
    );
    setNewUsersState((old) => ({
      ...old,
      isLoading: false,
      data: response?.data.users.docs,
      total: response?.data.users.totalDocs,
    }));
  };

  const getAllUsers = async () => {
    setUsersState((old) => ({ ...old, isLoading: true }));
    const response = await axiosJWT.post(
      `${BaseApi}/user?_page=${usersState.page}&_limit=${usersState.pageSize}`,
      {},
      {
        headers: {
          token: `Bearer ${accessToken}`,
        },
      },
    );
    setUsersState((old) => ({
      ...old,
      isLoading: false,
      data: response?.data.users.docs,
      total: response?.data.users.totalDocs,
    }));
  };

  useEffect(() => {
    getNewUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newUsersState.page, newUsersState.pageSize]);

  useEffect(() => {
    getAllUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usersState.page, usersState.pageSize]);

  const handleOpenCollapse = (key) => {
    setOpenCollapse((prev) => {
      const updatedState = {};
      for (const k in prev) {
        updatedState[k] =
          parseInt(k, 10) === parseInt(key, 10) ? !prev[k] : false;
      }
      return updatedState;
    });
  };

  const columns = [
    {
      field: '_id',
      headerName: 'User Id',
      width: 210,
    },
    { field: 'fullname', headerName: 'Full Name', width: 200 },
    {
      field: 'gender',
      headerName: 'Gender',
      width: 120,
      valueGetter: (values) => {
        return values === 0
          ? 'Male'
          : values === 1
            ? 'Female'
            : values === 2
              ? 'Other'
              : '---';
      },
    },
    { field: 'email', headerName: 'Email', width: 230 },
    { field: 'about', headerName: 'About', width: 230 },
    {
      field: 'isAdmin',
      headerName: 'Role',
      width: 100,
      valueGetter: (values) => {
        return values ? 'Admin' : 'User';
      },
    },
    {
      field: 'createdAt',
      headerName: 'Created At',
      width: 200,
      valueGetter: (values) => {
        return new Date(values).toLocaleString();
      },
    },
  ];

  return (
    <CustomBox>
      <Grid container spacing={2}>
        <Grid item xs={6} md={3}>
          <Paper elevation={3} sx={{ p: 1 }}>
            <BoxContainer>
              <BoxIcon>
                <SupervisedUserCircleRoundedIcon sx={{ fontSize: 50 }} />{' '}
                <IconButton
                  size="small"
                  aria-label="View the list of new users"
                  onClick={() => handleOpenCollapse(0)}
                >
                  {openCollapse[0] ? (
                    <VisibilityOffRoundedIcon />
                  ) : (
                    <VisibilityRoundedIcon />
                  )}
                </IconButton>
              </BoxIcon>
              <BoxItems>
                <Typography variant="h6" fontWeight={600}>
                  {t('admin:dashboard.total_users')}
                </Typography>
                <Typography variant="h5" fontWeight={600}>
                  {convertNumber(totalUsers)}
                </Typography>
              </BoxItems>
            </BoxContainer>
          </Paper>
        </Grid>
        <Grid item xs={6} md={3}>
          <Paper elevation={3} sx={{ p: 1 }}>
            <BoxContainer>
              <BoxIcon>
                <GroupAddRoundedIcon sx={{ fontSize: 50 }} />
                <IconButton
                  size="small"
                  aria-label="View the list of new users"
                  onClick={() => handleOpenCollapse(1)}
                >
                  {openCollapse[1] ? (
                    <VisibilityOffRoundedIcon />
                  ) : (
                    <VisibilityRoundedIcon />
                  )}
                </IconButton>
              </BoxIcon>
              <BoxItems>
                <Typography variant="h6" fontWeight={600}>
                  {t('admin:dashboard.new_users')}
                </Typography>
                <Typography variant="h5" fontWeight={600}>
                  {convertNumber(newUsersState.total)}
                </Typography>
              </BoxItems>
            </BoxContainer>
          </Paper>
        </Grid>
        <Grid item xs={6} md={3}>
          <Paper elevation={3} sx={{ p: 1 }}>
            1
          </Paper>
        </Grid>
        <Grid item xs={6} md={3}>
          <Paper elevation={3} sx={{ p: 1 }}>
            1
          </Paper>
        </Grid>
      </Grid>
      <Grid container spacing={2} marginTop={2}>
        <Grid item xs={12}>
          <Collapse in={openCollapse[0]}>
            <Paper elevation={3} sx={{ p: 2 }}>
              <DataTable
                state={usersState}
                setState={setUsersState}
                columns={columns}
              />
            </Paper>
          </Collapse>
          <Collapse in={openCollapse[1]}>
            <Paper elevation={3} sx={{ p: 2 }}>
              <DataTable
                state={newUsersState}
                setState={setUsersState}
                columns={columns}
              />
            </Paper>
          </Collapse>
        </Grid>
      </Grid>
    </CustomBox>
  );
}
