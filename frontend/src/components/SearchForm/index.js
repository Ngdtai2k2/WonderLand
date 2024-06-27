import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import LazyLoad from 'react-lazyload';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Avatar from '@mui/material/Avatar';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';

import SearchRoundedIcon from '@mui/icons-material/SearchRounded';

import LoadingCircularIndeterminate from '../Loading';

import { searchUsers } from '../../api/search';
import useUserAxios from '../../hooks/useUserAxios';

export default function SearchForm({ onClose }) {
  const [dataSearch, setDataSearch] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { t, i18n } = useTranslation(['navigation', 'message']);
  const { user } = useUserAxios(i18n.language);

  const handleViewSearchPage = (query) => {
    if (query !== '') {
      navigate(`/search?query=${query}`);
      onClose();
    }
    return;
  };

  const formik = useFormik({
    initialValues: {
      search: '',
    },
    validationSchema: Yup.object({
      search: Yup.string().max(100),
    }),
    onSubmit: (values) => handleViewSearchPage(values.search),
  });

  useEffect(() => {
    if (formik.values.search !== '') {
      searchUsers(
        i18n.language,
        user?._id,
        formik.values.search,
        [],
        setDataSearch,
        setIsLoading,
        true,
      );
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
        <TextField
          id="search"
          label={t('navigation:search')}
          placeholder=""
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
        <IconButton
          sx={{ marginX: 1 }}
          onClick={() => handleViewSearchPage(formik.values.search)}
        >
          <SearchRoundedIcon />
        </IconButton>
      </Box>
      <Box marginTop={1}>
        {isLoading ? (
          <LoadingCircularIndeterminate />
        ) : (
          <>
            {dataSearch.users?.data && dataSearch.users?.data.length > 0 && (
              <>
                {dataSearch.users?.data.map((user) => (
                  <MenuItem
                    key={user._id}
                    onClick={() => {
                      navigate(`/u/${user._id}`);
                    }}
                  >
                    <Box gap={1} display="flex">
                      <LazyLoad height={48} once>
                        <Avatar src={user?.media?.url} alt="avatar" />
                      </LazyLoad>
                      <Box display="flex" alignItems="center">
                        <Typography variant="body1">{user.fullname}</Typography>
                        <Typography
                          variant="caption"
                          display="flex"
                          alignItems="flex-start"
                          marginLeft={0.5}
                          marginTop={-1}
                        >
                          {user.nickname}
                        </Typography>
                      </Box>
                    </Box>
                  </MenuItem>
                ))}
                <Box display="flex" justifyContent="center">
                  <Link
                    onClick={() => handleViewSearchPage(formik.values.search)}
                  >
                    {t('navigation:view_more')}
                  </Link>
                </Box>
              </>
            )}
          </>
        )}
      </Box>
    </Box>
  );
}
