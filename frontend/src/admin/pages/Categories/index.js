import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Zoom from 'react-medium-image-zoom';
import { useTheme } from '@emotion/react';
import LazyLoad from 'react-lazyload';
import axios from 'axios';

import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

import AddRoundedIcon from '@mui/icons-material/AddRounded';

import DataTable from '../../components/DataTable';
import CustomBox from '../../../components/CustomBox';
import { API } from '../../../api/base';
import { createElementStyleForZoom } from '../../../constants/constant';
import ModalCategoryForm from './modalCategoryForm';

import 'react-medium-image-zoom/dist/styles.css';

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
  const { t } = useTranslation(['admin', 'message']);

  useEffect(() => {
    document.title = t('admin:categories.title');
  });

  const getAllCategories = async () => {
    setCategoriesState({
      ...categoriesState,
      isLoading: true,
    });
    const response = await axios.get(
      `${API.CATEGORY.BASE}?_page=${categoriesState.page}&_limit=${categoriesState.pageSize}`,
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
            <LazyLoad height={45} once>
              <Avatar
                src={params.row.media?.url}
                sx={{ width: 45, height: 45, p: 0.5 }}
                variant="rounded"
              />
            </LazyLoad>
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
              {t('admin:update')}
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
          {t('admin:categories.title')}
        </Typography>
        <Box display="flex" justifyContent="flex-end">
          <Button
            variant="contained"
            color="success"
            sx={{ width: 'fit-content' }}
            onClick={() => setOpenModal(true)}
          >
            <AddRoundedIcon /> {t('admin:add')}
          </Button>
        </Box>
      </Box>
      <Typography variant="caption" color="error" fontStyle="italic">
        {t('message:admin.note_after_update')}
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
