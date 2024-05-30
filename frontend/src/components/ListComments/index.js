import React, { useEffect, useRef, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import axios from 'axios';

import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Collapse from '@mui/material/Collapse';

import ArrowDropDownRoundedIcon from '@mui/icons-material/ArrowDropDownRounded';

import MenuSettings from './menuSettings';
import CommentItem from './commentItem';
import LoadingCircularIndeterminate from '../Loading';
import { useToastTheme, BaseApi } from '../../constants/constant';
import { getCommentsByPostId } from '../../utils/commentServices';
import { handleCloseMenu, handleOpenMenu } from '../../utils/helperFunction';
import useUserAxios from '../../hooks/useUserAxios';
import { BoxComment, ButtonLink } from './styles';

export default function ListComments({ postId, newComment }) {
  const [comments, setComments] = useState([]);
  const [replies, setReplies] = useState([]);
  const [delComments, setDelComments] = useState([]);
  const [delReplies, setDelReplies] = useState([]);
  const [delComment, setDelComment] = useState(null);
  const [delReply, setDelReply] = useState(null);

  const [hasMore, setHasMore] = useState(true);
  const [hasMoreReply, setHasMoreReply] = useState(true);

  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingReply, setIsLoadingReply] = useState(null);

  const [isMenuOpen, setIsMenuOpen] = useState({});
  const [menuAnchorEl, setMenuAnchorEl] = useState({});
  const [openCollapse, setOpenCollapse] = useState({});

  const { t, i18n } = useTranslation(['message', 'post']);
  const toastTheme = useToastTheme();
  const page = useRef(1);
  const { user, accessToken, axiosJWT } = useUserAxios(i18n.language);

  useEffect(() => {
    getCommentsByPostId(
      i18n.language,
      setIsLoading,
      setComments,
      comments,
      setHasMore,
      page,
      postId,
      user?._id,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setComments((prevData) => [newComment, ...prevData]);
  }, [newComment]);

  const handleDeleteComment = async (commentId) => {
    try {
      setDelComment(commentId);
      setIsMenuOpen((prev) => ({
        ...prev,
        [commentId]: false,
      }));
      const response = await axiosJWT.delete(
        `${BaseApi}/comment/${commentId}/delete?request_user=${user?._id}`,
        {
          headers: {
            token: `Bearer ${accessToken}`,
            'Accept-Language': i18n.language,
          },
        },
      );
      setDelComments([...delComments, commentId]);
      toast.success(response.data.message, toastTheme);
    } catch (error) {
      toast.error(error.response.data.message, toastTheme);
    } finally {
      setDelComment([]);
    }
  };

  const handleDelReply = async (commentId, replyId) => {
    try {
      setDelReply(replyId);
      setIsMenuOpen((prev) => ({
        ...prev,
        [replyId]: false,
      }));
      const response = await axiosJWT.delete(
        `${BaseApi}/comment/${commentId}/delete-reply/${replyId}?request_user=${user?._id}`,
        {
          'Accept-Language': i18n.language,
          headers: { token: `Bearer ${accessToken}` },
        },
      );
      setDelReplies([...delReplies, replyId]);
      toast.success(response.data.message, toastTheme);
    } catch (error) {
    } finally {
      setDelReply([]);
    }
  };

  const getReplies = async (commentId, page) => {
    try {
      setIsLoadingReply(commentId);
      const response = await axios.post(
        `${BaseApi}/comment/${commentId}/reply?_page=${page}&_limit=10`,
        {
          userId: user?._id,
        },
        {
          headers: {
            'Accept-Language': i18n.language,
          },
        },
      );
      if (response.data.replies.length > 0) {
        setReplies([...replies, ...response.data.replies]);
        setHasMoreReply(response.data.replies.length === 10);
      } else {
        setReplies([...replies]);
        setHasMoreReply(false);
      }
    } catch (error) {
      toast.error(error.response.data.message, toastTheme);
    } finally {
      setIsLoadingReply(null);
    }
  };

  const handleShowMoreCommentReply = async (commentId, currentPage = 1) => {
    const nextPage = currentPage + 1;
    getReplies(commentId, nextPage);
  };

  const handleShowReply = (commentId) => {
    setOpenCollapse((prevState) => ({
      ...prevState,
      [commentId]: !prevState[commentId],
    }));
    setReplies([]);
    if (!openCollapse[commentId]) {
      getReplies(commentId, 1);
    }
  };

  return (
    <>
      {isLoading ? (
        <LoadingCircularIndeterminate size={40} />
      ) : (
        <>
          {comments && comments.length > 0 ? (
            comments.map((comment) => {
              const commentId = comment._id;
              return (
                !delComments.includes(commentId) && (
                  <React.Fragment key={commentId}>
                    <BoxComment>
                      <CommentItem
                        data={comment}
                        state={replies}
                        setState={setReplies}
                        delComment={delComment}
                        handleShowReply={handleShowReply}
                        openCollapse={openCollapse}
                        handleOpenMenu={(event) =>
                          handleOpenMenu(
                            event,
                            comment._id,
                            setMenuAnchorEl,
                            setIsMenuOpen,
                          )
                        }
                      />
                      {/* menu settings for comments */}
                      <MenuSettings
                        id={commentId}
                        author={comment.author._id}
                        menuAnchorEl={menuAnchorEl[commentId]}
                        isMenuOpen={isMenuOpen[commentId]}
                        handleCloseMenu={() =>
                          handleCloseMenu(
                            commentId,
                            setMenuAnchorEl,
                            setIsMenuOpen,
                          )
                        }
                        handleDelete={() => handleDeleteComment(commentId)}
                        isReply={false}
                      />
                      {/* end  menu settings for comments*/}
                    </BoxComment>
                    {/* reply comments */}
                    {isLoadingReply === comment._id ? (
                      <LoadingCircularIndeterminate size={12} />
                    ) : (
                      <Collapse in={openCollapse[commentId] || false}>
                        {replies.length > 0 &&
                          replies.map(
                            (reply) =>
                              !delReplies.includes(reply._id) && (
                                <BoxComment paddingLeft={4} key={reply._id}>
                                  <CommentItem
                                    data={reply}
                                    state={replies}
                                    setState={setReplies}
                                    delComment={delReply}
                                    openCollapse={openCollapse}
                                    handleOpenMenu={(event) =>
                                      handleOpenMenu(
                                        event,
                                        reply._id,
                                        setMenuAnchorEl,
                                        setIsMenuOpen,
                                      )
                                    }
                                    handleShowReply={handleShowReply}
                                    isReply={true}
                                  />
                                  {/* menu setting reply */}
                                  <MenuSettings
                                    id={reply._id}
                                    commentId={reply.commentId}
                                    author={reply.author._id}
                                    menuAnchorEl={menuAnchorEl[reply._id]}
                                    isMenuOpen={isMenuOpen[reply._id]}
                                    handleCloseMenu={() =>
                                      handleCloseMenu(
                                        reply._id,
                                        setMenuAnchorEl,
                                        setIsMenuOpen,
                                      )
                                    }
                                    handleDelete={() => {
                                      handleDelReply(
                                        reply.commentId,
                                        reply._id,
                                      );
                                    }}
                                    isReply={true}
                                  />
                                  {/* end menu settings reply */}
                                </BoxComment>
                              ),
                          )}
                        {hasMoreReply && (
                          <ButtonLink
                            paddingLeft={7}
                            underline="hover"
                            sx={{ fontStyle: 'italic' }}
                            onClick={() =>
                              handleShowMoreCommentReply(commentId, 1)
                            }
                          >
                            <ArrowDropDownRoundedIcon />{' '}
                            {t('post:comment.load_more')}
                          </ButtonLink>
                        )}
                      </Collapse>
                    )}
                    <Divider />
                    {/* end reply comments*/}
                  </React.Fragment>
                )
              );
            })
          ) : (
            <Typography variant="h6" textAlign="center">
              {t('message:comment.no')}
            </Typography>
          )}
          <InfiniteScroll
            dataLength={comments.length}
            next={() => {
              getCommentsByPostId(
                i18n.language,
                setIsLoading,
                setComments,
                comments,
                setHasMore,
                page,
                postId,
                user?._id,
              );
            }}
            hasMore={hasMore}
            loader={<LoadingCircularIndeterminate />}
          ></InfiniteScroll>
        </>
      )}
    </>
  );
}
