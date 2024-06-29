import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

import { handleChangeEnterWord, updateBadWord } from '../../../api/badword';
import useUserAxios from '../../../hooks/useUserAxios';
import { useToastTheme } from '../../../constants/constant';
import { BoxModal } from '../styles';

export default function ModalUpdateBadWord({
  openModal,
  handleClose,
  data,
  setEventChange,
}) {
  const [word, setWord] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);

  const { t, i18n } = useTranslation(['admin']);
  const toastTheme = useToastTheme();
  const { accessToken, axiosJWT } = useUserAxios(i18n.language);

  const handleCheckBadword = async (word) => {
    const data = await handleChangeEnterWord(
      word,
      axiosJWT,
      accessToken,
      i18n.language,
    );
    setErrorMessage(data);
    if (!errorMessage) {
      setWord(word);
    }
  };

  const handleUpdate = async (word) => {
    if (word !== '' && word !== data?.word) {
      const res = await updateBadWord(
        data?._id,
        word,
        axiosJWT,
        accessToken,
        i18n.language,
      );
      toast[res.status === 200 ? 'success' : 'error'](
        res.data.message,
        toastTheme,
      );
      if (res.status === 200) {
        setEventChange(res.data.message);
        handleClose();
      }
    }
  };

  return (
    <Modal open={openModal} onClose={handleClose}>
      <BoxModal
        noValidate
        bgcolor="background.paper"
        width={{
          xs: '95%',
          sm: '75%',
          md: '50%',
        }}
        display="flex"
        flexDirection="column"
      >
        <Typography variant="h6" textAlign="center">
          {t('admin:badword.update')}
        </Typography>
        <TextField
          margin="normal"
          size="small"
          required
          fullWidth
          id="name"
          label={t('admin:badword.enter_word')}
          name="name"
          autoComplete="name"
          defaultValue={data?.word}
          onChange={(event) => {
            if (event.target.value.trim() !== '') {
              handleCheckBadword(event.target.value.trim());
            }
          }}
        />
        {errorMessage && (
          <Typography variant="caption" color="error">
            {errorMessage}
          </Typography>
        )}
        <Button
          variant="contained"
          color="success"
          aria-label="update word"
          size="small"
          onClick={() => handleUpdate(word)}
        >
          {t('admin:update')}
        </Button>
      </BoxModal>
    </Modal>
  );
}
