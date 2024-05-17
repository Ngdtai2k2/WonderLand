import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import TextField from '@mui/material/TextField';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';

import SearchRoundedIcon from '@mui/icons-material/SearchRounded';

import search from '../../utils/searchServices';
import LoadingCircularIndeterminate from '../Loading';
import useUserAxios from '../../hooks/useUserAxios';

export default function SearchForm({ onClose }) {
  const [dataSearch, setDataSearch] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { user } = useUserAxios();

  const formik = useFormik({
    initialValues: {
      search: '',
    },
    validationSchema: Yup.object({
      search: Yup.string().max(100),
    }),
    onSubmit: (values) => {
      navigate(`/search?query=${values.search}`);
      onClose();
    },
  });

  useEffect(() => {
    if (formik.values.search !== '') {
      search(user?._id, formik.values.search, [], setDataSearch, setIsLoading);
    } else {
      setDataSearch([]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formik.values.search]);

  return (
    <Box
      width={{
        xs: '95vw',
        sm: '50vw',
        md: '30vw',
      }}
    >
      <Box
        component="form"
        noValidate
        method="POST"
        onSubmit={formik.handleSubmit}
        paddingX={1}
        paddingY={0}
        display="flex"
        alignItems="flex-end"
      >
        <SearchRoundedIcon sx={{ mr: 1, my: 0.5 }} />
        <TextField
          id="search"
          label="Search"
          name="search"
          size="small"
          variant="standard"
          fullWidth
          autoFocus
          sx={{ boxShadow: 0 }}
          value={formik.values.search}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.search && Boolean(formik.errors.search)}
          helperText={formik.touched.search && formik.errors.search}
        />
      </Box>
      <Box marginY={1}>
        {isLoading ? (
          <LoadingCircularIndeterminate />
        ) : (
          <>
            {dataSearch.users?.data && dataSearch.users?.data.length > 0 && (
              <>
                <Typography
                  variant="body2"
                  marginLeft={2}
                  sx={{ cursor: 'pointer' }}
                  onClick={() => {
                    navigate(`/search?query=${formik.values.search}`);
                    onClose();
                  }}
                >
                  Users:
                </Typography>
                {dataSearch.users?.data.map((user) => (
                  <MenuItem
                    key={user._id}
                    onClick={() => {
                      navigate(`/u/${user._id}`);
                    }}
                  >
                    <Box gap={1} display="flex">
                      <Avatar src={user?.media?.url} />
                      <Typography variant="body1">{user.fullname}</Typography>
                      <Typography variant="caption">{user.nickname}</Typography>
                    </Box>
                  </MenuItem>
                ))}
              </>
            )}
            {dataSearch.posts?.data && dataSearch.posts?.data.length > 0 && (
              <Typography
                variant="body2"
                marginLeft={2}
                sx={{ cursor: 'pointer' }}
                onClick={() => {
                  navigate(`/search?query=${formik.values.search}`);
                  onClose();
                }}
              >
                Posts (Click here to view all)
              </Typography>
            )}
          </>
        )}
      </Box>
    </Box>
  );
}
