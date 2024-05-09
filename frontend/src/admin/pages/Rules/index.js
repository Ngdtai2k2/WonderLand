import React, { useEffect, useState } from 'react';
import axios from 'axios';

import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

import AddRoundedIcon from '@mui/icons-material/AddRounded';

import CustomBox from '../../../components/CustomBox';
import { BaseApi } from '../../../constants/constant';
import DataTable from '../../components/DataTable';
import ModalRuleForm from './modalRuleForm';

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
          <Button
            variant="outlined"
            color="success"
            onClick={() => handleOpenModalUpdate(params.row)}
          >
            Update
          </Button>
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
        <Typography variant="caption" color="error" fontStyle="italic">
          Note*: After adding new data, refresh the page (f5) again to update
          the data.
        </Typography>
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
        <DataTable
          state={rulesState}
          setState={setRulesState}
          columns={columns}
        />
      </Box>
    </CustomBox>
  );
}
