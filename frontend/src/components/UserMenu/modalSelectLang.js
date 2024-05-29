import React from 'react';
import { useTranslation } from 'react-i18next';

import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';

import { BoxModal } from '../styles';
import { locales } from '../../constants/constant';

export default function ModalSelectLang({ open, handleClose }) {
  const { t, i18n } = useTranslation(['navigation']);
  const currentLanguage = i18n.language;

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('language', lng);
    handleClose();
    window.location.reload();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-change-language"
      aria-describedby="modal-change-language"
    >
      <BoxModal
        bgcolor="background.paper"
        borderRadius="5px"
        width={{
          xs: '95%',
          sm: '60%',
          md: '40%',
        }}
        height="auto"
      >
        <Typography
          variant="h6"
          fontWeight={600}
          textAlign="center"
          marginBottom={2}
        >
          {t('navigation:select_lng')}
        </Typography>
        <FormControl fullWidth>
          <Select
            size="small"
            value={currentLanguage}
            onChange={(e) => changeLanguage(e.target.value)}
          >
            {locales.map((locale) => (
              <MenuItem key={locale.code} value={locale.code}>
                {locale.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </BoxModal>
    </Modal>
  );
}
