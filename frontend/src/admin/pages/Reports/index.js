import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useTheme } from '@emotion/react';

import Typography from '@mui/material/Typography';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import LoadingButton from '@mui/lab/LoadingButton';

import CustomBox from '../../../components/CustomBox';
import LoadingCircularIndeterminate from '../../../components/Loading';
import DataTable from '../../components/DataTable';
import ModalWebView from '../../components/ModalWebView';
import { createAxios } from '../../../createInstance';
import {
  BaseApi,
  createElementStyleForZoom,
  useToastTheme,
} from '../../../constants/constant';
import { LinkStyle } from './styles';

export default function ReportsManager() {
  const [reportState, setReportState] = useState({
    isLoading: false,
    data: [],
    total: 0,
    page: 1,
    pageSize: 5,
  });
  const [selectStatus, setSelectStatus] = useState(0);
  const [selectOrder, setSelectOrder] = useState(0);
  const [openModal, setOpenModal] = useState(false);
  const [dataWebView, setDataWebView] = useState({ src: '', title: '' });
  const [loadingReject, setLoadingReject] = useState({});

  const dispatch = useDispatch();
  const theme = useTheme();
  const toastTheme = useToastTheme();

  const user = useSelector((state) => state.auth.login?.currentUser);
  const accessToken = user?.accessToken;

  let axiosJWT = user ? createAxios(user, dispatch) : undefined;

  useEffect(() => {
    document.title = 'Reports management';
  }, []);

  const getAllReports = async () => {
    setReportState({
      ...reportState,
      isLoading: true,
    });
    const response = await axiosJWT.get(
      `${BaseApi}/report?_status=${selectStatus}&_page=${reportState.page}
        &_limit=${reportState.pageSize}&_order=${selectOrder ? 'asc' : 'desc'}`,
      {
        headers: {
          token: `Bearer ${accessToken}`,
        },
      },
    );
    setReportState((old) => ({
      ...old,
      isLoading: false,
      data: response?.data.result.docs,
      total: response?.data.result.totalDocs,
    }));
  };

  useEffect(() => {
    getAllReports();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reportState.page, reportState.pageSize, selectStatus, selectOrder]);

  useEffect(() => {
    createElementStyleForZoom(theme);
  }, [theme, theme.palette.mode]);

  const handleChangeSelect = (event, setState) => {
    setState(event.target.value);
  };

  const handleOpenModal = (src, title) => {
    setOpenModal(true);
    setDataWebView({
      src: src,
      title: title,
    });
  };

  const handleRejectReport = async (id) => {
    try {
      setLoadingReject((prevState) => ({
        ...prevState,
        [id]: true,
      }));
      const response = await axiosJWT.post(`${BaseApi}/report/${id}/reject`, {
        headers: {
          token: `Bearer ${accessToken}`,
        },
      });
      toast.success(response.data.message, toastTheme);
      getAllReports();
    } catch (e) {
      toast.success(e.response.data.message, toastTheme);
    } finally {
      setLoadingReject((prevState) => ({
        ...prevState,
        [id]: false,
      }));
    }
  };

  const columns = [
    {
      field: '_id',
      headerName: 'ID',
      width: 210,
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 80,
      renderCell: (params) => {
        return (
          <Typography
            variant="caption"
            fontWeight={700}
            color={
              params.row?.status === 1
                ? '#00e676'
                : params.row?.status === 2
                  ? '#ff1744'
                  : '#ff9800'
            }
          >
            {params.row?.status === 1
              ? 'Done'
              : params.row?.status === 2
                ? 'Rejected'
                : 'Pending'}
          </Typography>
        );
      },
    },
    {
      field: 'user',
      headerName: 'Reporter',
      width: 150,
      renderCell: (params) => {
        return (
          <Tooltip title="Go to profile">
            <LinkStyle
              onClick={() =>
                handleOpenModal(
                  `/u/${params.row.user?.nickname}`,
                  'Web view profile',
                )
              }
            >
              {params.row.user?.nickname}
            </LinkStyle>
          </Tooltip>
        );
      },
    },
    {
      field: 'reason',
      headerName: 'Reason',
      width: 210,
      renderCell: (params) => {
        return params.row.reason || '---';
      },
    },
    {
      field: 'Post',
      headerName: 'Post',
      width: 210,
      renderCell: (params) => {
        return (
          <Tooltip title="Go to post">
            <LinkStyle
              onClick={() =>
                handleOpenModal(
                  `/post/${params.row.post?._id}`,
                  'Web view profile',
                )
              }
            >
              {params.row.post?.title}
            </LinkStyle>
          </Tooltip>
        );
      },
    },
    {
      field: 'Comment',
      headerName: 'Comment',
      width: 210,
      renderCell: (params) => {
        return (
          <Typography variant="caption" fontWeight={700}>
            {params.row?.comment?._id || '---'}
          </Typography>
        );
      },
    },
    {
      field: 'reply',
      headerName: 'Reply',
      width: 210,
      renderCell: (params) => {
        return (
          <Typography variant="caption" fontWeight={700}>
            {params.row?.reply?._id || '---'}
          </Typography>
        );
      },
    },
    {
      field: 'createdAt',
      headerName: 'Created at',
      width: 210,
      renderCell: (params) => {
        return new Date(params.row.createdAt).toLocaleString();
      },
    },
    {
      field: 'updatedAt',
      headerName: 'Updated at',
      width: 210,
      renderCell: (params) => {
        return new Date(params.row.updatedAt).toLocaleString();
      },
    },
    {
      field: 'action',
      headerName: 'Action',
      width: 210,
      renderCell: (params) => {
        return (
          selectStatus !== 2 && (
            <LoadingButton
              loading={
                loadingReject[params.row._id]
                  ? loadingReject[params.row._id]
                  : false
              }
              variant="outlined"
              color="error"
              onClick={() => handleRejectReport(params.row._id)}
            >
              Reject
            </LoadingButton>
          )
        );
      },
    },
  ];

  return (
    <CustomBox>
      <Typography variant="h6" fontWeight={700}>
        Report list
      </Typography>
      <Box display="flex" gap={1}>
        <FormControl sx={{ marginY: 2, minWidth: 120 }} size="small">
          <InputLabel id="status-report-select-label">Status select</InputLabel>
          <Select
            labelId="status-report-select-label"
            id="status-report-select"
            value={selectStatus}
            label="Status select"
            onChange={(event) => handleChangeSelect(event, setSelectStatus)}
          >
            <MenuItem value={0}>Pending</MenuItem>
            <MenuItem value={1}>Done</MenuItem>
            <MenuItem value={2}>Rejected</MenuItem>
          </Select>
        </FormControl>
        <FormControl sx={{ marginY: 2, minWidth: 120 }} size="small">
          <InputLabel id="sort-order-report-select-label">
            Sort order
          </InputLabel>
          <Select
            labelId="sort-order-report-select-label"
            id="sort-order-report-select"
            value={selectOrder}
            label="Sort order"
            onChange={(event) => handleChangeSelect(event, setSelectOrder)}
          >
            <MenuItem value={0}>Most recent</MenuItem>
            <MenuItem value={1}>Oldest</MenuItem>
          </Select>
        </FormControl>
      </Box>
      {reportState.isLoading ? (
        <LoadingCircularIndeterminate />
      ) : (
        <>
          <DataTable
            state={reportState}
            setState={setReportState}
            columns={columns}
          />
          <ModalWebView
            openModal={openModal}
            handleClose={() => setOpenModal(false)}
            src={dataWebView.src}
            title={dataWebView.title}
          />
        </>
      )}
    </CustomBox>
  );
}