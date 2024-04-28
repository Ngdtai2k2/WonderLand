import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

import Pagination from '@mui/material/Pagination';
import Box from '@mui/material/Box';

import LoadingCircularIndeterminate from '../../components/Loading';
import PostCard from '../../components/PostCard';
import NoData from '../../components/NoData';

import { toastTheme } from '../../constants/constant';

export default function RenderPostInTab({ apiLink }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const { id } = useParams();

  useEffect(() => {
    const getSavedPost = async () => {
      try {
        setLoading(true);
        const response = await axios.post(
          `${apiLink}?_page=${page}&_limit=5&_order=desc`,
          {
            userId: id,
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
    getSavedPost();
  }, [apiLink, id, page]);

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
        <PostCard key={post._id} post={post} xs="100%" md="70%" />
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
