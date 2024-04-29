import React, { useEffect, useRef, useState } from 'react';
import moment from 'moment';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import InfiniteScroll from 'react-infinite-scroll-component';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';

import ThumbDownOutlinedIcon from '@mui/icons-material/ThumbDownOutlined';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import ThumbUpRoundedIcon from '@mui/icons-material/ThumbUpRounded';
import ThumbDownRoundedIcon from '@mui/icons-material/ThumbDownRounded';
import MoreVertTwoToneIcon from '@mui/icons-material/MoreVertTwoTone';

import LoadingCircularIndeterminate from '../Loading';
import { useToastTheme, BaseApi } from '../../constants/constant';
import { createAxios } from '../../createInstance';
import { ImageStyle } from './styles';
import { Divider } from '@mui/material';

export default function ListComments({ postId, newComment }) {
  const [data, setData] = useState([]);
  const [deletedComments, setDeletedComments] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [fetching, setFetching] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState({});
  const [menuAnchorEl, setMenuAnchorEl] = useState({});

  const dispatch = useDispatch();
  const toastTheme = useToastTheme();
  const page = useRef(1);

  const user = useSelector((state) => state.auth.login?.currentUser);
  const accessToken = user?.accessToken;
  let axiosJWT = createAxios(user, dispatch);

  const handleClick = (event, commentId) => {
    setMenuAnchorEl((prev) => ({
      ...prev,
      [commentId]: event.currentTarget,
    }));
    setIsMenuOpen((prev) => ({
      ...prev,
      [commentId]: true,
    }));
  };

  const handleClose = (commentId) => {
    setMenuAnchorEl((prev) => ({
      ...prev,
      [commentId]: null,
    }));
    setIsMenuOpen((prev) => ({
      ...prev,
      [commentId]: false,
    }));
  };

  const getCommentsByPostId = async (postId) => {
    try {
      setIsLoading(true);
      await axios
        .get(
          `${BaseApi}/comment/post/${postId}?_page=${page.current}&_limit=10`,
        )
        .then((response) => {
          if (response.data.result.docs.length === 0) {
            setData([...data]);
            setHasMore(false);
          } else {
            setData([...data, ...response.data.result.docs]);
            setHasMore(response.data.result.docs.length === 10);
            page.current = page.current + 1;
          }
        });
    } catch (error) {
      toast.error(error.response.data.message, toastTheme);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getCommentsByPostId(postId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postId]);

  useEffect(() => {
    setData((prevData) => [newComment, ...prevData]);
  }, [newComment]);

  const handleDeleteComment = async (commentId) => {
    try {
      setFetching(commentId);
      setIsMenuOpen((prev) => ({
        ...prev,
        [commentId]: false,
      }));
      const response = await axiosJWT.delete(
        `${BaseApi}/comment/${commentId}`,
        {
          headers: { token: `Bearer ${accessToken}` },
        },
      );
      setDeletedComments([...deletedComments, commentId]);
      toast.success(response.data.message, toastTheme);
    } catch (error) {
      toast.error(error.response.data.message, toastTheme);
    } finally {
      setFetching(null);
    }
  };

  return (
    <>
      {isLoading ? (
        <LoadingCircularIndeterminate size={40} />
      ) : (
        <List>
          {data && data.length > 0 ? (
            data.map(
              (comment) =>
                !comment.parentCommentId &&
                !deletedComments.includes(comment._id) && (
                  <React.Fragment key={comment._id}>
                    <ListItem sx={{ paddingX: 0, gap: 1 }}>
                      <Link
                        href={`/profile/u/${comment.author._id}`}
                        underline="none"
                      >
                        <Avatar
                          src={comment.author.avatar}
                          alt={`${comment.author.fullname}'s avatar`}
                        />
                      </Link>
                      <Box width="100%">
                        <Link
                          href={`/profile/u/${comment.author._id}`}
                          underline="none"
                        >
                          <Typography
                            variant="body2"
                            fontWeight={600}
                            display="flex"
                            alignItems="flex-start"
                          >
                            {comment.author.fullname}
                            <Typography variant="caption" marginLeft={0.5}>
                              {moment(comment?.createdAt).fromNow()}
                            </Typography>
                          </Typography>
                        </Link>
                        <Typography variant="body1">
                          {comment.content}
                        </Typography>
                        {comment.media?.url && (
                          <ImageStyle src={comment.media?.url} alt="" />
                        )}
                        <Box
                          display="flex"
                          justifyContent="space-between"
                          alignItems="center"
                        >
                          <Box
                            display="flex"
                            justifyContent="flex-start"
                            alignItems="center"
                            gap={1}
                          >
                            <Typography variant="body2">Reply</Typography>
                            <IconButton aria-label="like" size="small">
                              {isLiked ? (
                                <ThumbUpRoundedIcon color="info" />
                              ) : (
                                <ThumbUpOutlinedIcon />
                              )}
                            </IconButton>
                            <Typography variant="body1" marginLeft={-0.7}>
                              11
                            </Typography>
                            <IconButton aria-label="dislike" size="small">
                              {isDisliked ? (
                                <ThumbDownRoundedIcon color="error" />
                              ) : (
                                <ThumbDownOutlinedIcon />
                              )}
                            </IconButton>
                            <Typography variant="body1" marginLeft={-0.7}>
                              11
                            </Typography>
                          </Box>
                          <IconButton
                            id={`btn-menu-${comment._id}`}
                            onClick={(event) => handleClick(event, comment._id)}
                          >
                            {fetching === comment._id ? (
                              <LoadingCircularIndeterminate size={16} />
                            ) : (
                              <MoreVertTwoToneIcon />
                            )}
                          </IconButton>
                        </Box>
                      </Box>
                      <Menu
                        key={`menu-${comment._id}`}
                        id={`menu-${comment._id}`}
                        anchorEl={menuAnchorEl[comment._id]}
                        open={isMenuOpen[comment._id] || false}
                        onClose={() => handleClose(comment._id)}
                        anchorOrigin={{
                          vertical: 'top',
                          horizontal: 'left',
                        }}
                        transformOrigin={{
                          vertical: 'top',
                          horizontal: 'left',
                        }}
                      >
                        {comment.author._id === user?._id && [
                          <MenuItem
                            key={`delete-${comment._id}`}
                            onClick={() => handleDeleteComment(comment._id)}
                          >
                            Delete
                          </MenuItem>,
                          <MenuItem
                            key={`edit-${comment._id}`}
                            onClick={handleClose}
                          >
                            Edit
                          </MenuItem>,
                        ]}
                        <MenuItem
                          key={`report-${comment._id}`}
                          onClick={handleClose}
                        >
                          Report
                        </MenuItem>
                      </Menu>
                    </ListItem>
                    <Divider />
                  </React.Fragment>
                ),
            )
          ) : (
            <div>No comments</div>
          )}
          <InfiniteScroll
            dataLength={data.length}
            next={() => {
              getCommentsByPostId(postId);
            }}
            hasMore={hasMore}
            loader={<LoadingCircularIndeterminate />}
          ></InfiniteScroll>
        </List>
      )}
    </>
  );
}
