import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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
import { BaseApi } from '../../../constants/constant';
import { createAxios } from '../../../createInstance';

import 'react-medium-image-zoom/dist/styles.css';
import ModalAdd from './modalAdd';

export default function Categories() {
  const [openModal, setOpenModal] = useState(false);
  const [categoriesState, setCategoriesState] = useState({
    isLoading: false,
    data: [],
    total: 0,
    page: 1,
    pageSize: 5,
  });

  const theme = useTheme();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.auth.login?.currentUser);
  const accessToken = user?.accessToken;
  let axiosJWT = createAxios(user, dispatch);

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
    const style = document.createElement('style');
    style.textContent = `
    [data-rmiz-modal-overlay="visible"] {
      background-color: ${theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.9)' : 'rgba(255, 255, 255, 0.9)'};
    }
  `;
    document.head.appendChild(style);
  }, [theme.palette.mode]);

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
      renderCell: (values) => {
        return (
          <Zoom>
            <Avatar
              src={values.row.media?.url}
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
      width: 210,
    },
    {
      field: 'description',
      headerName: 'Description',
      width: 210,
    },
    {
      field: 'createdAt',
      headerName: 'Created at',
      width: 210,
      valueGetter: (values) => {
        return new Date(values).toLocaleString();
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
      <ModalAdd openModal={openModal} handleClose={() => setOpenModal(false)} />
      <DataTable
        state={categoriesState}
        setState={setCategoriesState}
        columns={columns}
      />
    </CustomBox>
  );
}
