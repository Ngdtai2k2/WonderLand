import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';

import CustomBox from '../../../components/CustomBox';

import { API } from '../../../api/base';
import {
  addBadWord,
  deleteBadWord,
  handleChangeEnterWord,
} from '../../../api/badword';
import useUserAxios from '../../../hooks/useUserAxios';
import DataTable from '../../components/DataTable';
import { useToastTheme } from '../../../constants/constant';
import ModalUpdateBadWord from './modalUpdate';

export default function BadWord() {
  const [badWordListState, setBadWordListState] = useState({
    isLoading: false,
    data: [],
    total: 0,
    page: 1,
    pageSize: 5,
  });
  const [errorMessage, setErrorMessage] = useState(null);
  const [newBadWord, setNewBadWord] = useState('');
  const [event, setEvent] = useState();
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [openModalUpdate, setOpenModalUpdate] = useState(false);

  const { t, i18n } = useTranslation(['admin']);
  const toastTheme = useToastTheme();
  const { accessToken, axiosJWT } = useUserAxios(i18n.language);

  useEffect(() => {
    document.title = t('admin:badword.title');
  }, [t]);

  const getAllBadWords = async () => {
    setBadWordListState({
      ...badWordListState,
      isLoading: true,
    });
    const response = await axiosJWT.get(
      `${API.BAD_WORD.GET}?_page=${badWordListState.page}&_limit=${badWordListState.pageSize}`,
      {
        headers: {
          token: `Bearer ${accessToken}`,
        },
      },
    );
    setBadWordListState((old) => ({
      ...old,
      isLoading: false,
      data: response?.data.results.docs,
      total: response?.data.results.totalDocs,
    }));
  };

  useEffect(() => {
    getAllBadWords();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [event, badWordListState.page, badWordListState.pageSize]);

  const handleCheckBadword = async (word) => {
    const data = await handleChangeEnterWord(
      word,
      axiosJWT,
      accessToken,
      i18n.language,
    );
    setErrorMessage(data);
    if (!errorMessage) {
      setNewBadWord(word);
    }
  };

  const handleAddBadword = async (word) => {
    if (!errorMessage && word.trim() !== '') {
      const res = await addBadWord(word, axiosJWT, accessToken, i18n.language);
      if (res.status === 201) {
        toast.success(res.data.message, toastTheme);
        getAllBadWords();
        setNewBadWord('');
      } else {
        toast.error(res.data.message, toastTheme);
      }
    }
  };

  const handleDeleteBadword = async (id) => {
    const res = await deleteBadWord(id, axiosJWT, accessToken, i18n.language);
    if (res?.status === 200) {
      toast.success(res.data.message, toastTheme);
      getAllBadWords();
    } else {
      toast.error(res.data.message, toastTheme);
    }
  };

  const handleOpenModalUpdateBadword = async (rowData) => {
    setSelectedRowData(rowData);
    setOpenModalUpdate(true);
  };

  const columns = [
    { field: '_id', headerName: 'ID', width: 200 },
    {
      field: 'word',
      headerName: 'Word',
      width: 200,
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
      headerName: 'Action',
      width: 200,
      disableClick: true,
      renderCell: (params) => {
        return (
          <Box display="flex" gap={1}>
            <Box>
              <Button
                variant="outlined"
                color="error"
                onClick={() => handleDeleteBadword(params.row._id)}
              >
                {t('admin:delete')}
              </Button>
            </Box>
            <Box>
              <Button
                variant="outlined"
                color="success"
                onClick={() => handleOpenModalUpdateBadword(params.row)}
              >
                {t('admin:update')}
              </Button>
            </Box>
          </Box>
        );
      },
    },
  ];
  return (
    <CustomBox>
      <Box>
        <Typography variant="h6" fontWeight={700} marginBottom={2}>
          {t('admin:badword.title')}
        </Typography>
        <Box display="flex" alignItems="center" gap={1}>
          <TextField
            size="small"
            label={t('admin:badword.add')}
            placeholder={t('admin:badword.enter_word')}
            variant="outlined"
            onChange={(event) => {
              if (event.target.value.trim() !== '') {
                handleCheckBadword(event.target.value.trim());
              }
            }}
            color={errorMessage && 'error'}
          />
          <Button
            variant="contained"
            color="success"
            sx={{ textTransform: 'none' }}
            onClick={() => handleAddBadword(newBadWord)}
          >
            {t('admin:add')}
          </Button>
        </Box>
        {errorMessage && (
          <Typography variant="caption" color="error">
            {errorMessage}
          </Typography>
        )}
      </Box>
      <Box marginTop={5}>
        <DataTable
          state={badWordListState}
          setState={setBadWordListState}
          columns={columns}
        />
        <ModalUpdateBadWord
          openModal={openModalUpdate}
          handleClose={() => setOpenModalUpdate(false)}
          data={selectedRowData}
          setEventChange={setEvent}
        />
      </Box>
    </CustomBox>
  );
}
