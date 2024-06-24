import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

import useUserAxios from '../../hooks/useUserAxios';
import { searchUsers } from '../../api/search';
import ListItemUser from '../../components/ListItemUser';
import { ListContainerResult } from './styles';
import LoadingCircularIndeterminate from '../../components/Loading';

export default function PeopleTab({ query }) {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const { t, i18n } = useTranslation(['search']);
  const { user } = useUserAxios(i18n.language);

  useEffect(() => {
    searchUsers(
      i18n.language,
      user?._id,
      query,
      users,
      setUsers,
      setIsLoading,
      false,
      setHasMore,
      currentPage,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, user, i18n, currentPage]);

  const loadMore = () => {
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
  };

  return (
    <>
      <Typography variant="h6" fontWeight={600}>
        {t('search:people')}
      </Typography>
      {isLoading ? (
        <LoadingCircularIndeterminate />
      ) : (
        <ListContainerResult>
          {users?.users?.data?.length > 0 &&
            users.users.data.map((item) => (
              <ListItemUser
                key={item?._id}
                _id={item?._id}
                nickname={item?.nickname}
                avatar={item?.media?.url}
                isFriend={item?.isFriend}
                totalFriend={item?.totalFriend}
              />
            ))}
          {hasMore && (
            <Box display="flex" justifyContent="center" marginBottom={0.5}>
              <Button
                variant="outlined"
                size="small"
                sx={{ textTransform: 'none' }}
                onClick={loadMore}
              >
                {t('search:view_all')}
              </Button>
            </Box>
          )}
        </ListContainerResult>
      )}
    </>
  );
}
