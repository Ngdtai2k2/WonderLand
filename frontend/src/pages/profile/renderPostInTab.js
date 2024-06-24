import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

import Box from '@mui/material/Box';
import Pagination from '@mui/material/Pagination';

import NoData from '../../components/NoData';
import PostCard from '../../components/PostCard';
import LoadingCircularIndeterminate from '../../components/Loading';

import { useToastTheme } from '../../constants/constant';
import useUserAxios from '../../hooks/useUserAxios';

export default function RenderPostInTab({ apiLink }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [refresh, setRefresh] = useState();

  const { id } = useParams();
  const toastTheme = useToastTheme();
  const { i18n } = useTranslation();
  const { user } = useUserAxios(i18n.language);

  useEffect(() => {
    const getPostsByUser = async () => {
      try {
        setLoading(true);
        const url = user
          ? `${apiLink}?request_user=${user._id}&_page=${page}&_limit=5&_order=desc`
          : `${apiLink}?_page=${page}&_limit=5&_order=desc`;
        const response = await axios.post(
          url,
          {
            author: id,
          },
          {
            headers: {
              'Accept-Language': i18n.language,
            },
          },
        );
        setData(response.data.result);
      } catch (error) {
        if (error.response && error.response.status === 404) {
          setData(null);
          toast.error('Cannot find data!', toastTheme);
        } else {
          toast.error('Something went wrong!', toastTheme);
        }
      } finally {
        setLoading(false);
      }
    };
    getPostsByUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiLink, id, page, refresh]);

  const handleChangePage = (event, value) => {
    setPage(value);
  };

  return loading ? (
    <LoadingCircularIndeterminate />
  ) : data?.docs?.length > 0 ? (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      gap={2}
    >
      {data?.docs?.map((post) => (
        <PostCard
          key={post._id}
          post={post}
          detail={false}
          xs="100%"
          md="65%"
          setState={setRefresh}
        />
      ))}
      <Pagination
        count={data?.totalPages}
        page={page}
        onChange={handleChangePage}
      />
    </Box>
  ) : (
    <NoData />
  );
}
