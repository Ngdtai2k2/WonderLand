import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import LoadingButton from '@mui/lab/LoadingButton';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import MenuItem from '@mui/material/MenuItem';

import DeleteIcon from '@mui/icons-material/Delete';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

import { useToastTheme, BaseApi } from '../../constants/constant';
import useUserAxios from '../../hooks/useUserAxios';
import LoadingCircularIndeterminate from '../Loading';
import getCategories from '../../utils/categoryServices';
import { getPostById } from '../../utils/postServices';
import { BoxModal, VisuallyHiddenInput } from '../styles';
import { FlexCenterBox } from './styles';

export default function ModalEditPost({ open, handleClose, id, setState }) {
  const [category, setCategory] = useState(null);
  const [file, setFile] = useState(null);
  const [typeFile, setTypeFile] = useState(false);
  const [loading, setLoading] = useState(true);
  const [fetching, setFetching] = useState();
  const [post, setPost] = useState();

  const toastTheme = useToastTheme();
  const { user, accessToken, axiosJWT } = useUserAxios();

  useEffect(() => {
    getCategories(setCategory, setLoading, toastTheme);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (id) {
      getPostById(id, setPost, toastTheme);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    if (post) {
      formik.setValues({
        category: post.category?._id || '',
        title: post.title || '',
        content: post.content || '',
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [post]);

  const validationSchema = Yup.object().shape({
    category: Yup.string().required('Category is required'),
    title: Yup.string()
      .required('Title is required')
      .max(280, 'Title must be under 280 characters'),
    ...(post?.type === 0
      ? {
          file: Yup.mixed()
            .required('File is required!')
            .test('fileType', 'File not supported!', (value) => {
              if (!value) return true;
              const imageTypes = [
                'image/jpeg',
                'image/png',
                'image/jpg',
                'image/gif',
              ];
              const videoTypes = ['video/mp4', 'video/mkv'];
              return (
                value &&
                (imageTypes.includes(value.type) ||
                  videoTypes.includes(value.type))
              );
            }),
        }
      : {
          content: Yup.string().max(
            1500,
            'Content must be under 1500 characters!',
          ),
        }),
  });

  const formik = useFormik({
    initialValues: { category: '', title: '', file: '', content: '' },
    validationSchema,
    onSubmit: async (values) => {
      try {
        setFetching(true);
        const formData = new FormData();
        Object.entries(values).forEach(([key, value]) => {
          formData.append(key, value);
        });

        const response = await axiosJWT.put(
          `${BaseApi}/post/update/${id}?request_user=${user?._id}`,
          formData,
          {
            headers: { token: `Bearer ${accessToken}` },
            'Content-Type': 'multipart/form-data',
          },
        );
        toast.success(response.data.message, toastTheme);
        setState(response.data.updatedPost._id);
        handleClose();
      } catch (error) {
        toast.error(error.response.data.message, toastTheme);
      } finally {
        setFetching(false);
      }
    },
  });

  const handleClearFile = () => {
    setFile(null);
    formik.setFieldValue('file', null);
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-edit-form"
      aria-describedby="modal-edit-form-description"
    >
      {loading ? (
        <LoadingCircularIndeterminate />
      ) : (
        <BoxModal
          bgcolor="background.paper"
          width={{
            xs: '95%',
            sm: '70%',
            md: '50%',
          }}
          component="form"
          noValidate
          method="POST"
          onSubmit={formik.handleSubmit}
          sx={{
            overflowY: 'auto',
            maxHeight: 500,
          }}
        >
          <Typography variant="h6" textAlign="center">
            Update post
          </Typography>
          <Typography variant="caption">
            Note: After update your post, please allow 1 moment for us to upload
            your file!
          </Typography>
          <TextField
            required
            margin="normal"
            id="category-update"
            select
            label="Category"
            name="category"
            fullWidth
            size="small"
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
            margin="normal"
            required
            id="title-update"
            name="title"
            label="Title"
            type="text"
            fullWidth
            size="small"
            value={formik.values.title}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.title && Boolean(formik.errors.title)}
            helperText={formik.touched.title && formik.errors.title}
          />
          {post?.type === 1 && (
            <TextField
              multiline
              rows={2}
              margin="normal"
              id="content-update"
              label="Content"
              type="text"
              name="content"
              fullWidth
              value={formik.values.content}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.content && Boolean(formik.errors.content)}
              helperText={formik.touched.content && formik.errors.content}
            />
          )}
          {post?.type === 0 && (
            <>
              <Typography variant="caption" color="error" fontStyle="italic">
                Please update the new photo when updating the post!
              </Typography>
              <Paper variant="outlined" sx={{ p: 2, marginY: 1 }}>
                <Box
                  display="flex"
                  flexDirection="column"
                  width="100%"
                  maxHeight={500}
                >
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
                          id="file-update"
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
                        style={{ height: 250, objectFit: 'contain' }}
                      />
                    ) : (
                      <video
                        autoPlay
                        loop
                        muted
                        style={{ height: 250 }}
                        controls
                      >
                        <source src={file} type="" />
                      </video>
                    )
                  ) : null}
                </Box>
              </Paper>
            </>
          )}
          <FlexCenterBox>
            <LoadingButton
              loading={fetching ? fetching : false}
              variant="outlined"
              type="submit"
              sx={{
                width: {
                  xs: '30%',
                  md: '20%',
                },
              }}
            >
              Update
            </LoadingButton>
          </FlexCenterBox>
        </BoxModal>
      )}
    </Modal>
  );
}
