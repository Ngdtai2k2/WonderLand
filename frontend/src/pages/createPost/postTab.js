import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import MenuItem from '@mui/material/MenuItem';

import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CreateRoundedIcon from '@mui/icons-material/CreateRounded';
import DeleteIcon from '@mui/icons-material/Delete';

import { createAxios } from '../../createInstance';
import { FlexCenterBox } from './styles';
import { toastTheme } from '../../constants/constant';
import { VisuallyHiddenInput } from '../styles';
import LoadingCircularIndeterminate from '../../components/Loading';
import { BaseApi } from '../../constants/constant';

export default function PostTab() {
  const [category, setCategory] = useState(null);
  const [file, setFile] = useState(null);
  const [typeFile, setTypeFile] = useState(false);
  const [loading, setLoading] = useState(true);
  const [fetching, setFetching] = useState();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state) => state.auth.login?.currentUser);
  const accessToken = user?.accessToken;
  let axiosJWT = createAxios(user, dispatch);

  useEffect(() => {
    const getCategory = async () => {
      try {
        const response = await axios.get(BaseApi + '/v1/category');
        setCategory(response.data.result.docs);
        setLoading(false);
      } catch (error) {
        toast.error(error.message, toastTheme);
      }
    };
    getCategory();
  }, []);

  const validationSchema = Yup.object({
    category: Yup.string().required('Category is required'),
    content: Yup.string()
      .required('Content is required')
      .max(280, 'Content must be under 280 characters'),
    file: Yup.mixed().test('fileType', 'File not supported!', (value) => {
      if (!value) return true;
      const imageTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];
      const videoTypes = ['video/mp4', 'video/mkv'];
      return (
        value &&
        (imageTypes.includes(value.type) || videoTypes.includes(value.type))
      );
    }),
  });

  const formik = useFormik({
    initialValues: { category: '', content: '', file: '' },
    validationSchema,
    onSubmit: async (values) => {
      try {
        setFetching(true);
        const formData = new FormData();
        formData.append('author', user?._id);
        Object.entries(values).forEach(([key, value]) => {
          formData.append(key, value);
        });

        const response = await axiosJWT.post('/v1/post/create', formData, {
          headers: { token: `Bearer ${accessToken}` },
        });
        toast.success(response.data.message, toastTheme);
        navigate('/');
      } catch (error) {
        toast.error(error.message, toastTheme);
      } finally {
        setFetching(false);
      }
    },
  });

  const handleClearFile = () => {
    setFile(null);
    formik.setFieldValue('file', null);
  };

  return loading ? (
    <LoadingCircularIndeterminate />
  ) : (
    <Box
      component="form"
      noValidate
      method="POST"
      onSubmit={formik.handleSubmit}
      display="flex"
      justifyContent="center"
      flexDirection="column"
    >
      <Typography variant="caption">
        Note: After creating your post, please allow 1 moment for us to upload
        your file!
      </Typography>
      <TextField
        required
        margin="normal"
        id="category"
        select
        label="Category"
        name="category"
        fullWidth
        value={formik.values.category}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.category && Boolean(formik.errors.category)}
        helperText={formik.touched.category && formik.errors.category}
      >
        {category &&
          category.map((item) => (
            <MenuItem key={item._id} value={item._id}>
              <Box display="flex" alignItems="center" gap={2}>
                <Avatar
                  variant="square"
                  alt={item.media?.description}
                  src={item.media?.url}
                  sx={{ width: 32, height: 32 }}
                />
                <Typography variant="body1">{item.name}</Typography>
              </Box>
            </MenuItem>
          ))}
      </TextField>
      <TextField
        multiline
        rows={3}
        margin="normal"
        required
        id="content"
        label="Content"
        type="text"
        value={formik.values.content}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.content && Boolean(formik.errors.content)}
        helperText={formik.touched.content && formik.errors.content}
      />
      <Paper variant="outlined" sx={{ p: 2, marginY: 1 }}>
        <Box display="flex" flexDirection="column" width="100%" maxHeight={500}>
          {file ? (
            <FlexCenterBox marginY={1}>
              <Button
                startIcon={<DeleteIcon />}
                onClick={handleClearFile}
                variant="outlined"
              >
                Clear File
              </Button>
            </FlexCenterBox>
          ) : (
            <>
              <Button
                component="label"
                role={undefined}
                variant="outlined"
                tabIndex={-1}
              >
                <VisuallyHiddenInput
                  type="file"
                  id="file"
                  name="file"
                  accept="image/*,video/*"
                  onBlur={formik.handleBlur}
                  onChange={(event) => {
                    const files = event.currentTarget.files[0];
                    formik.setFieldValue('file', files);
                    URL.revokeObjectURL(files);
                    setFile(URL.createObjectURL(files));
                    setTypeFile(files.type.startsWith('image/'));
                  }}
                />
                <FlexCenterBox flexDirection="column">
                  <CloudUploadIcon />
                  <Typography variant="body1">Choose file</Typography>
                </FlexCenterBox>
              </Button>
              <Typography
                variant="caption"
                fontStyle="italic"
                textAlign="center"
              >
                Support files with PNG, JPG, JPEG, GIF, MKV or MP4 file.
              </Typography>
            </>
          )}
          {file ? (
            typeFile ? (
              <img
                src={file}
                alt=""
                style={{ height: 300, objectFit: 'contain' }}
              />
            ) : (
              <video autoPlay loop muted style={{ height: 300 }} controls>
                <source src={file} type="" />
              </video>
            )
          ) : null}
        </Box>
      </Paper>
      <FlexCenterBox>
        <LoadingButton
          loading={fetching ? fetching : false}
          loadingPosition="start"
          variant="outlined"
          startIcon={<CreateRoundedIcon />}
          type="submit"
          disabled={!formik.dirty || formik.isSubmitting || !formik.isValid}
          sx={{
            width: {
              xs: '30%',
              md: '20%',
            },
          }}
        >
          Post
        </LoadingButton>
      </FlexCenterBox>
    </Box>
  );
}
