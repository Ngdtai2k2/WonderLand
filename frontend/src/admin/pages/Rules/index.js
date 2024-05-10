import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';

import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import LoadingButton from '@mui/lab/LoadingButton';

import AddRoundedIcon from '@mui/icons-material/AddRounded';

import CustomBox from '../../../components/CustomBox';
import DataTable from '../../components/DataTable';
import { BaseApi, useToastTheme } from '../../../constants/constant';
import ModalRuleForm from './modalRuleForm';
import { createAxios } from '../../../createInstance';

export default function Rules() {
  const [openModal, setOpenModal] = useState(false);
  const [openModalUpdate, setOpenModalUpdate] = useState(false);
  const [rulesState, setRulesState] = useState({
    isLoading: false,
    data: [],
    total: 0,
    page: 1,
    pageSize: 5,
  });
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [loadingDelete, setLoadingDelete] = useState({});

  const toastTheme = useToastTheme();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.login?.currentUser);
  const accessToken = user?.accessToken;

  let axiosJWT = user ? createAxios(user, dispatch) : undefined;

  useEffect(() => {
    document.title = 'Rules management';
  });

  const getRules = async () => {
    setRulesState({
      ...rulesState,
      isLoading: true,
    });
    const response = await axios.get(
      `${BaseApi}/rule?_page=${rulesState.page}&_limit=${rulesState.pageSize}`,
    );
    setRulesState((old) => ({
      ...old,
      isLoading: false,
      data: response?.data.result.docs,
      total: response?.data.result.totalDocs,
    }));
  };

  useEffect(() => {
    getRules();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rulesState.page, rulesState.pageSize]);

  const handleOpenModalUpdate = (rowData) => {
    setSelectedRowData(rowData);
    setOpenModalUpdate(true);
  };

  const handleDelete = async (id) => {
    try {
      setLoadingDelete((prevState) => ({ ...prevState, [id]: true }));
      const response = await axiosJWT.delete(`${BaseApi}/rule/delete/${id}`, {
        headers: { token: `Bearer ${accessToken}` },
      });
      toast.success(response.data.message, toastTheme);
      getRules();
    } catch (error) {
      toast.error(error.response.message, toastTheme);
    } finally {
      setLoadingDelete((prevState) => ({ ...prevState, [id]: false }));
    }
  };

  const columns = [
    {
      field: '_id',
      headerName: 'ID',
      width: 210,
    },
    {
      field: 'name',
      headerName: 'Name',
      width: 200,
    },
    {
      field: 'description',
      headerName: 'Description',
      width: 200,
    },
    {
      field: 'createdAt',
      headerName: 'Created At',
      width: 200,
      valueGetter: (values) => {
        return new Date(values).toLocaleString();
      },
    },
    {
      field: 'updatedAt',
      headerName: 'Updated At',
      width: 200,
      valueGetter: (values) => {
        return new Date(values).toLocaleString();
      },
    },
    {
      field: 'action',
      headerName: 'Action',
      width: 150,
      renderCell: (params) => {
        return (
          <Box display="flex" gap={1} marginTop={0.5}>
            <Button
              variant="outlined"
              color="success"
              onClick={() => handleOpenModalUpdate(params.row)}
            >
              Update
            </Button>
            <LoadingButton
              variant="outlined"
              color="error"
              loading={loadingDelete[params.row._id]}
              onClick={() => handleDelete(params.row._id)}
            >
              Delete
            </LoadingButton>
          </Box>
        );
      },
    },
  ];

  return (
    <CustomBox>
      <Box
        display="flex"
        sx={{
          justifyContent: {
            md: 'space-between',
          },
          flexDirection: {
            xs: 'column',
            md: 'row',
          },
        }}
      >
        <Typography variant="h6" fontWeight={700}>
          Rules management
        </Typography>
        <Box display="flex" justifyContent="flex-end">
          <Button
            variant="contained"
            color="success"
            sx={{ width: 'fit-content' }}
            onClick={() => setOpenModal(true)}
          >
            <AddRoundedIcon /> Add
          </Button>
        </Box>
        <ModalRuleForm
          openModal={openModal}
          handleClose={() => setOpenModal(false)}
          isUpdate={false}
        />
        <ModalRuleForm
          openModal={openModalUpdate}
          handleClose={() => setOpenModalUpdate(false)}
          data={selectedRowData}
          isUpdate={true}
        />
      </Box>
      <Typography variant="caption" color="error" fontStyle="italic">
        Note*: After adding new data, refresh the page (f5) again to update the
        data.
      </Typography>
      <DataTable
        state={rulesState}
        setState={setRulesState}
        columns={columns}
      />
    </CustomBox>
  );
}
