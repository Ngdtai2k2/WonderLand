import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateField } from '@mui/x-date-pickers/DateField';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Avatar from "@mui/material/Avatar";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import dayjs from 'dayjs';
import MenuItem from '@mui/material/MenuItem';
import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { createAxios } from '../../createInstance';
import { loginSuccess } from '../../redux/slice/userSlice';
import { ShortenContent } from '../../helpers/shortenContent';
import { updateUser } from '../../redux/apiRequest/userApi';
import { VisuallyHiddenInput } from '../styles';

export default function Profile() {
  const [filename, setFilename] = useState('');
  const [image, setImage] = useState();

  const dispatch = useDispatch();

  const user = useSelector((state) => state.auth.login?.currentUser);
  const accessToken = user?.accessToken;

  let axiosJWT = createAxios(user, dispatch, loginSuccess);

  const validationSchema = Yup.object({
    fullname: Yup.string().required('Fullname is required!'),
    phone: Yup.string(),
    about: Yup.string(),
    hometown: Yup.string(),
    birthDate: Yup.date(),
    image: Yup.mixed().test('fileType', 'File not support!', (value) => {
      if (!value) return true;
      return (
        value &&
        ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'].includes(
          value.type,
        )
      );
    }),
  });

  const formik = useFormik({
    initialValues: {
      fullname: user?.fullname || '',
      phone: user?.phone || '',
      about: user?.about || '',
      gender: user?.gender || '',
      hometown: user?.hometown || '',
      birthday: user?.birthday ? dayjs(user?.birthday) : null,
      image: '',
    },

    validationSchema: validationSchema,
    onSubmit: async (values) => {
      const formData = new FormData();
      formData.append('fullname', values.fullname);
      formData.append('phone', values.phone);
      formData.append('about', values.about);
      formData.append('gender', values.gender);
      formData.append('hometown', values.hometown);
      formData.append('file', values.image);
      if (formik.values.birthday !== null){
        formData.append("birthday", values.birthday);
      }

      await updateUser(accessToken, dispatch, user?._id, axiosJWT, formData);
    },
  });

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box
        component="form"
        noValidate
        onSubmit={formik.handleSubmit}
        method="PUT"
      >
        <Typography variant="h5" fontWeight={700}>
          Profile
        </Typography>
        <Box marginTop={2} display="flex" flexDirection="column">
          <Box display="flex" alignItems="center" gap={2} marginBottom={2}>
            <Avatar
              alt={'Avatar of ' + user?.fullname}
              src={image ? image : user?.media?.url}
              sx={{ width: 80, height: 80 }}
            />
            <Box display="flex" flexDirection="column">
              <Button
                component="label"
                role={undefined}
                variant="outlined"
                size="small"
                tabIndex={-1}
                startIcon={<CloudUploadIcon />}
              >
                <VisuallyHiddenInput
                  type="file"
                  id="image"
                  name="image"
                  accept="image/*"
                  onBlur={formik.handleBlur}
                  onChange={(event) => {
                    formik.setFieldValue('image', event.currentTarget.files[0]);
                    setFilename(event.currentTarget.files[0].name);
                    setImage(URL.createObjectURL(event.currentTarget.files[0]));
                  }}
                />
                {filename ? ShortenContent(filename, 30) : 'Uploade image'}
              </Button>
              <Typography variant="caption" marginTop={0.5}>
                JPG, JEPG, GIF or PNG, Max size: 5MB
              </Typography>
              {formik.touched.image && formik.errors.image && (
                <Typography variant="caption" color="error">
                  {formik.errors.image}
                </Typography>
              )}
            </Box>
          </Box>
          <TextField
            margin="normal"
            required
            fullWidth
            id="fullname"
            label="Full Name"
            type="text"
            size="small"
            value={formik.values.fullname}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.fullname && Boolean(formik.errors.fullname)}
            helperText={formik.touched.fullname && formik.errors.fullname}
          />
          <DateField
            size="small"
            label="Birthday"
            sx={{ marginY: 1 }}
            value={formik.values.birthday}
            onChange={(date) => formik.setFieldValue('birthday', date)}
            helperText={formik.touched.birthday && formik.errors.birthday}
            onBlur={formik.handleBlur}
            error={formik.touched.birthday && Boolean(formik.errors.birthday)}
          />
          <TextField
            margin="normal"
            fullWidth
            id="phone"
            label="Phone"
            type="text"
            size="small"
            value={formik.values.phone}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.phone && Boolean(formik.errors.phone)}
            helperText={formik.touched.phone && formik.errors.phone}
          />
          <TextField
            margin="normal"
            fullWidth
            multiline
            rows={4}
            id="about"
            label="About"
            type="text"
            value={formik.values.about}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.about && Boolean(formik.errors.about)}
            helperText={formik.touched.about && formik.errors.about}
          />
          <TextField
            margin="normal"
            id="gender"
            select
            label="Gender"
            name="gender"
            size="small"
            value={formik.values.gender}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.gender && Boolean(formik.errors.gender)}
            helperText={formik.touched.gender && formik.errors.gender}
          >
            <MenuItem value={0}>Male</MenuItem>
            <MenuItem value={1}>Female</MenuItem>
            <MenuItem value={2}>Other</MenuItem>
          </TextField>
          <TextField
            margin="normal"
            fullWidth
            id="hometown"
            label="Hometown"
            type="hometown"
            size="small"
            value={formik.values.hometown}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.hometown && Boolean(formik.errors.hometown)}
            helperText={formik.touched.hometown && formik.errors.hometown}
          />
        </Box>
        <Button
          type="submit"
          variant="contained"
          sx={{ marginTop: 2 }}
          disabled={!formik.dirty || formik.isSubmitting || !formik.isValid}
        >
          Save
        </Button>
      </Box>
    </LocalizationProvider>
  );
}
