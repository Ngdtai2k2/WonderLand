import React from 'react';

import Modal from '@mui/material/Modal';

import { BoxModal } from '../../pages/styles';

export default function ModalWebView({ openModal, handleClose, src, title }) {
  return (
    <Modal open={openModal} onClose={handleClose}>
      <BoxModal bgcolor="background.paper" width="95%" height="80%">
        <iframe
          src={src}
          title={title}
          width="100%"
          height="100%"
          frameBorder={0}
        />
      </BoxModal>
    </Modal>
  );
}
