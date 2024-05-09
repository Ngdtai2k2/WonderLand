import React, { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { useFormik } from 'formik';

import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import LoadingButton from '@mui/lab/LoadingButton';

import { BoxModal } from '../styles';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { useToastTheme, BaseApi } from '../../../constants/constant';
import { createAxios } from '../../../createInstance';

export default function ModalRuleForm({
  openModal,
  handleClose,
  isUpdate,
  data,
}) {
  const [fetching, setFetching] = useState(false);

  const dispatch = useDispatch();
  const toastTheme = useToastTheme();

  const user = useSelector((state) => state.auth.login?.currentUser);
  const accessToken = user?.accessToken;

  let axiosJWT = user ? createAxios(user, dispatch) : undefined;

  useEffect(() => {
    if (isUpdate && data) {
      formik.setValues({
        name: data.name || '',
        description: data.description || '',
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isUpdate, data]);

  const validationSchema = Yup.object({
    name: Yup.string()
      .required('Please enter a name!')
      .min(1, 'This field must have a minimum of 1 character')
      .max(100, 'This field is no more than 100 characters!'),
    description: Yup.string()
      .required('Please enter a description!')
      .min(1, 'This field must have a minimum of 1 character')
      .max(3000, 'This field is no more than 3000 characters!'),
  });

  const formik = useFormik({
    initialValues: {
      name: '',
      description: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        setFetching(true);
        const response = await (isUpdate
          ? axiosJWT.put(
              `${BaseApi}/rule/update/${data?._id}`,
              {
                name: values.name.trim(),
                description: values.description.trim(),
              },
              {
                headers: { token: `Bearer ${accessToken}` },
              },
            )
          : axiosJWT.post(
              `${BaseApi}/rule/create`,
              {
                name: values.name,
                description: values.description,
              },
              {
                headers: { token: `Bearer ${accessToken}` },
              },
            ));
        if (!isUpdate) {
          formik.resetForm();
        }
        return toast.success(response.data.message, toastTheme);
      } catch (error) {
        return toast.error(error.response.data.message, toastTheme);
      } finally {
        setFetching(false);
      }
    },
  });

  return (
    <Modal open={openModal} onClose={handleClose}>
      <BoxModal
        component="form"
        noValidate
        onSubmit={formik.handleSubmit}
        method="POST"
        bgcolor="background.paper"
        width={{
          xs: '95%',
          sm: '70%',
          md: '45%',
        }}
      >
        <Typography variant="h6">{isUpdate ? 'Update' : 'Add'} Rule</Typography>
        <TextField
          margin="normal"
          required
          id="name-rule"
          label="Name"
          name="name"
          autoComplete="name"
          value={formik.values.name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.name && Boolean(formik.errors.name)}
          helperText={formik.touched.name && formik.errors.name}
          fullWidth
          size="small"
          variant="outlined"
        />
        <TextField
          margin="normal"
          required
          id="description-rule"
          label="Description"
          name="description"
          autoComplete="description"
          multiline
          rows={4}
          value={formik.values.description}
          onBlur={formik.handleBlur}
          onChange={(e) => {
            if (e.keyCode === 13 && e.shiftKey) {
              e.preventDefault();
              formik.setFieldValue(
                'description',
                `${formik.values.description}\n` +
                  e.target.value.substring(
                    e.target.selectionStart,
                    e.target.selectionEnd,
                  ),
              );
            } else {
              formik.handleChange(e);
            }
          }}
          error={
            formik.touched.description && Boolean(formik.errors.description)
          }
          helperText={formik.touched.description && formik.errors.description}
          fullWidth
          size="small"
          variant="outlined"
        />
        <Box display="flex" justifyContent="center" marginTop={3}>
          <LoadingButton
            loading={fetching ? fetching : false}
            variant="outlined"
            type="submit"
            disabled={!formik.dirty || formik.isSubmitting || !formik.isValid}
          >
            Save
          </LoadingButton>
        </Box>
      </BoxModal>
    </Modal>
  );
}