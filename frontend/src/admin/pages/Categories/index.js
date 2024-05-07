import React, { useEffect, useState } from 'react';
import Zoom from 'react-medium-image-zoom';
import { useTheme } from '@emotion/react';
import axios from 'axios';

import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

import AddRoundedIcon from '@mui/icons-material/AddRounded';

import DataTable from '../../components/DataTable';
import CustomBox from '../../../components/CustomBox';
import {
  BaseApi,
  createElementStyleForZoom,
} from '../../../constants/constant';
import ModalCategoryForm from './modalCategoryForm';

export default function Categories() {
  const [openModal, setOpenModal] = useState(false);
  const [openModalUpdate, setOpenModalUpdate] = useState(false);
  const [categoriesState, setCategoriesState] = useState({
    isLoading: false,
    data: [],
    total: 0,
    page: 1,
    pageSize: 5,
  });
  const [selectedRowData, setSelectedRowData] = useState(null);

  const theme = useTheme();

  useEffect(() => {
    document.title = 'Categories management';
  });

  const getAllCategories = async () => {
    setCategoriesState({
      ...categoriesState,
      isLoading: true,
    });
    const response = await axios.get(
      `${BaseApi}/category?_page=${categoriesState.page}&_limit=${categoriesState.pageSize}`,
    );
    setCategoriesState((old) => ({
      ...old,
      isLoading: false,
      data: response?.data.result.docs,
      total: response?.data.result.totalDocs,
    }));
  };

  useEffect(() => {
    getAllCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoriesState.page, categoriesState.pageSize]);

  useEffect(() => {
    createElementStyleForZoom(theme);
  }, [theme, theme.palette.mode]);

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
      field: 'media',
      headerName: 'Avatar',
      width: 110,
      renderCell: (params) => {
        return (
          <Zoom>
            <Avatar
              src={params.row.media?.url}
              sx={{ width: 45, height: 45, p: 0.5 }}
              variant="rounded"
            />
          </Zoom>
        );
      },
    },
    {
      field: 'name',
      headerName: 'Name',
      width: 150,
    },
    {
      field: 'description',
      headerName: 'Description',
      width: 250,
    },
    {
      field: 'createdAt',
      headerName: 'Created at',
      width: 210,
      valueGetter: (values) => {
        return new Date(values).toLocaleString();
      },
    },
    {
      field: 'updatedAt',
      headerName: 'Updated at',
      width: 210,
      valueGetter: (values) => {
        return new Date(values).toLocaleString();
      },
    },
    {
      field: '',
      headerName: 'Actions',
      width: 120,
      renderCell: (params) => {
        return (
          <>
            <Button
              variant="outlined"
              color="success"
              onClick={() => handleOpenModalUpdate(params.row)}
            >
              update
            </Button>
          </>
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
          Categories management
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
      </Box>
      <Typography variant="caption" color="error" fontStyle="italic">
        Note*: After adding new data, refresh the page (f5) again to update the
        data.
      </Typography>
      <ModalCategoryForm
        openModal={openModal}
        handleClose={() => setOpenModal(false)}
        isUpdate={false}
      />
      <ModalCategoryForm
        isUpdate={true}
        openModal={openModalUpdate}
        handleClose={() => setOpenModalUpdate(false)}
        data={selectedRowData}
      />
      <DataTable
        state={categoriesState}
        setState={setCategoriesState}
        columns={columns}
      />
    </CustomBox>
  );
}
