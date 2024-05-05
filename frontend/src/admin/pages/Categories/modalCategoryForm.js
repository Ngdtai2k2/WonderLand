import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import { useFormik } from 'formik';

import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Badge from '@mui/material/Badge';
import LoadingButton from '@mui/lab/LoadingButton';

import { BaseApi, useToastTheme } from '../../../constants/constant';
import { createAxios } from '../../../createInstance';
import { ImageStyle } from './styles';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 2,
  width: {
    xs: '95%',
    md: '50%',
  },
};

export default function ModalCategoryForm({
  openModal,
  handleClose,
  isUpdate,
  data,
}) {
  const [file, setFile] = useState();
  const [fetching, setFetching] = useState();

  const dispatch = useDispatch();
  const toastTheme = useToastTheme();

  const user = useSelector((state) => state.auth.login?.currentUser);
  const accessToken = user?.accessToken;

  let axiosJWT = createAxios(user, dispatch);

  useEffect(() => {
    if (isUpdate && data) {
      formik.setValues({
        name: data.name || '',
        description: data.description || '',
        file: '',
      });
      if (data.media && data.media.url) {
        setFile(data.media.url);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isUpdate, data]);

  const validateSchemaForCreate = Yup.object({
    name: Yup.string().required('Please enter a name!'),
    description: Yup.string().required('Please enter a description!'),
    file: Yup.mixed()
      .required('Please upload a photo!')
      .test('fileType', 'File not supported!', (value) => {
        if (!value) return true;
        const imageTypes = [
          'image/jpeg',
          'image/png',
          'image/jpg',
          'image/gif',
        ];
        return value && imageTypes.includes(value.type);
      }),
  });

  const validateSchemaForUpdate = Yup.object({
    name: Yup.string(),
    description: Yup.string(),
    file: Yup.mixed().test('fileType', 'File not supported!', (value) => {
      if (!value) return true;
      const imageTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];
      return value && imageTypes.includes(value.type);
    }),
  });
  const validateSchema = isUpdate
    ? validateSchemaForUpdate
    : validateSchemaForCreate;

  const formik = useFormik({
    initialValues: {
      name: '',
      description: '',
      file: '',
    },
    validateSchema,
    onSubmit: async (values) => {
      try {
        setFetching(true);
        const formData = new FormData();

        formData.append('name', values.name);
        formData.append('description', values.description);
        formData.append('file', values.file);

        const response = await (isUpdate
          ? axiosJWT.put(`${BaseApi}/category/update/${data?._id}`, formData, {
              headers: { token: `Bearer ${accessToken}` },
            })
          : axiosJWT.post(`${BaseApi}/category/create`, formData, {
              headers: { token: `Bearer ${accessToken}` },
            }));

        if (!isUpdate) {
          formik.resetForm();
          handleClearFile();
        }

        toast.success(response.data.message, toastTheme);
      } catch (error) {
        toast.error(error.response.data.message, toastTheme);
      } finally {
        setFetching(false);
      }
    },
  });

  const handleClearFile = () => {
    setFile(null);
    document.getElementById('file').value = '';
    formik.setFieldValue('file', null);
  };

  return (
    <Modal open={openModal} onClose={handleClose}>
      <Box
        component="form"
        noValidate
        onSubmit={formik.handleSubmit}
        sx={style}
        method="POST"
      >
        <Typography variant="h6">
          {isUpdate ? 'Update' : 'Add'} category
        </Typography>
        <TextField
          margin="normal"
          size="small"
          required
          fullWidth
          id="name"
          label="Name"
          name="name"
          autoComplete="name"
          value={formik.values.name}
          onChange={formik.handleChange}
          error={formik.touched.name && Boolean(formik.errors.name)}
          helperText={formik.touched.name && formik.errors.name}
        />
        <TextField
          margin="normal"
          size="small"
          required
          fullWidth
          id="description"
          label="Description"
          name="description"
          autoComplete="description"
          value={formik.values.description}
          onChange={formik.handleChange}
          error={
            formik.touched.description && Boolean(formik.errors.description)
          }
          helperText={formik.touched.description && formik.errors.description}
        />
        <Box display="flex" flexDirection="column" marginTop={2}>
          <Box>
            <input
              type="file"
              id="file"
              name="file"
              accept="image/jpeg,image/png,image/jpg,image/gif"
              onBlur={formik.handleBlur}
              onChange={(event) => {
                const files = event.currentTarget.files[0];
                formik.setFieldValue('file', files);
                URL.revokeObjectURL(files);
                setFile(URL.createObjectURL(files));
              }}
            />
          </Box>

          {formik.touched.file && formik.errors.file && (
            <Typography variant="caption" color="error">
              {formik.errors.file}
            </Typography>
          )}
          <Typography variant="caption" marginTop={0.5}>
            JPG, JEPG, GIF or PNG, Max size: 5MB
          </Typography>
          {file && (
            <Box marginTop={2}>
              <Badge
                badgeContent="x"
                color="error"
                onClick={() => handleClearFile()}
                sx={{ cursor: 'pointer' }}
              >
                <ImageStyle src={file} alt="Preview image upload" />
              </Badge>
            </Box>
          )}
        </Box>
        <Box display="flex" justifyContent="center" marginTop={3}>
          <LoadingButton
            loading={fetching ? fetching : false}
            variant="outlined"
            type="submit"
          >
            Save
          </LoadingButton>
        </Box>
      </Box>
    </Modal>
  );
}
