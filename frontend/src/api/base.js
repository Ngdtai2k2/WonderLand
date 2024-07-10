const baseApi = process.env.REACT_APP_BASE_URL;

const createEndpoint = (endpoint) => `${baseApi}/${endpoint}`;

export const API = {
  BASE_URL: baseApi,
  AUTH: {
    BASE: createEndpoint('auth'),
    LOGIN: createEndpoint('auth/login'),
    REGISTER: createEndpoint('auth/register'),
    LOGOUT: createEndpoint('auth/logout'),
    CHANGE_PASSWORD: (userId) => createEndpoint(`auth/password/${userId}`),
    REFRESH_TOKEN: (id, device) =>
      createEndpoint(`auth/refresh/${id}/${device}`),
    FORGET_PASSWORD: createEndpoint('auth/forgot-password'),
    RESET_PASSWORD: createEndpoint('auth/reset-password'),
    CHECK_NICKNAME: createEndpoint('auth/check-nickname'),
  },
  CATEGORY: {
    BASE: createEndpoint('category'),
    CREATE: createEndpoint('category/create'),
    UPDATE: (categoryId) => createEndpoint(`category/update/${categoryId}`),
    DETAIL: (categoryId) => createEndpoint(`category/detail/${categoryId}`),
    LIKE: (categoryId) => createEndpoint(`category/like/${categoryId}`),
    FOLLOW: (categoryId) => createEndpoint(`category/follow/${categoryId}`),
    NOTIFICATION: (categoryId, userId) =>
      createEndpoint(`category/${categoryId}/notifications/${userId}`),
  },
  USER: {
    BASE: createEndpoint('user'),
    GET: (userId) => createEndpoint(`user/${userId}`),
    UPDATE: (userId) => createEndpoint(`user/${userId}`),
    DELETE: (userId) => createEndpoint(`user/${userId}`),
    CHANGE_AVATAR: (userId) => createEndpoint(`user/media-update/${userId}`),
    TOTAL: createEndpoint('user/total'),
    REGISTERED_TODAY: createEndpoint('user/today'),
    POST: createEndpoint('user/post'),
    GET_BALANCE: (userId) =>
      createEndpoint(`user/balance?request_user=${userId}`),
  },
  REPORT: {
    BASE: createEndpoint('report'),
    REJECT: (id) => createEndpoint(`report/${id}/reject`),
    CREATE: (type) => createEndpoint(`report/create?_report=${type}`),
    REPLY: (commentId) =>
      createEndpoint(`report/create?_report=reply&_comment_id=${commentId}`),
  },
  POST: {
    BASE: createEndpoint('post'),
    DETAIL: (postId) => createEndpoint(`post/d/${postId}`),
    CREATE: createEndpoint('post/create'),
    GET: (type, order) => createEndpoint(`post/${type}?_order=${order}&`),
    DELETE: (postId, userId) =>
      createEndpoint(`post/delete/${postId}?request_user=${userId}`),
    DELETE_POST_REPORT: (id, reportId) =>
      createEndpoint(`post/delete/${id}/report/${reportId}`),
    UPDATE: (postId, userId) =>
      createEndpoint(`post/update/${postId}?request_user=${userId}`),
    GET_BY_CATEGORY: (categoryId, isFresh, order, sort) =>
      createEndpoint(
        `post/category/${categoryId}?_isFresh=${isFresh}&_order=${order}&_sort=${sort}&`,
      ),
    VIEW: createEndpoint('post/view'),
  },
  RULE: {
    BASE: createEndpoint('rule'),
    CREATE: createEndpoint('rule/create'),
    DELETE: (id) => createEndpoint(`rule/delete/${id}`),
    UPDATE: (id) => createEndpoint(`rule/update/${id}`),
  },
  MESSAGE: {
    BASE: createEndpoint('message'),
    GET: (chatId, userId) =>
      createEndpoint(`message/${chatId}?request_user=${userId}`),
    COUNT_UNREAD: (userId) =>
      createEndpoint(`message/count-unread?request_user=${userId}`),
    MARK_MESSAGE_BY_CHAT: (userId) =>
      createEndpoint(`message/mark-message?request_user=${userId}`),
  },
  CHAT: {
    BASE: createEndpoint('chat'),
    GET_BY_USER_ID: (userId) => createEndpoint(`chat/${userId}`),
    DELETE: (chatId, userId) =>
      createEndpoint(`chat/delete/${chatId}?request_user=${userId}`),
  },
  SOCKET: {
    BASE: createEndpoint('socket'),
    ONLINE: (userId) => createEndpoint(`socket/online/${userId}`),
    LIST_ONLINE: createEndpoint('socket/online'),
  },
  FRIEND: {
    BASE: createEndpoint('friend'),
    REQUEST_FRIEND: createEndpoint('friend/request-friend'),
    DELETE: (userId) =>
      createEndpoint(`friend/delete-friend?request_user=${userId}`),
    ACCEPT_REQUEST: createEndpoint('friend/accept-request'),
    CANCEL_REQUEST: createEndpoint('friend/cancel-request'),
    SEND_REQUEST: createEndpoint('friend/send-request'),
  },
  REACTION: {
    BASE: createEndpoint('reaction'),
    LIKE_COMMENT: createEndpoint('reaction/comment/like'),
    LIKE_REPLY: createEndpoint('reaction/reply/like'),
    LIKE_POST: createEndpoint('reaction/like'),
    POST: createEndpoint('reaction/post'),
  },
  COMMENT: {
    BASE: createEndpoint('comment'),
    CREATE: createEndpoint('comment/create'),
    REPLY: (commentId) => createEndpoint(`comment/${commentId}/reply`),
    DELETE: (commentId, userId) =>
      createEndpoint(`comment/${commentId}/delete?request_user=${userId}`),
    DELETE_REPLY: (commentId, replyId, userId) =>
      createEndpoint(
        `comment/${commentId}/delete-reply/${replyId}?request_user=${userId}`,
      ),
    GET_BY_POST: (postId) => createEndpoint(`comment/post/${postId}`),
  },
  NOTIFICATION: {
    BASE: createEndpoint('notification'),
    CONFIRM_READ: (notificationId, userId) =>
      createEndpoint(
        `notification/confirm-read/${notificationId}?request_user=${userId}`,
      ),
    COUNT_UNREAD: (userId) =>
      createEndpoint(`notification/count-unread?request_user=${userId}`),
    GET_BY_USER_ID: (userId, page, limit, order, type) =>
      createEndpoint(
        `notification/user?request_user=${userId}&_page=${page}&_limit=${limit}&_order=${order}${type && `&type=${type}`}`,
      ),
  },
  SAVE_POST: {
    BASE: createEndpoint('save-post'),
    POST: createEndpoint('save-post/post'),
  },
  SEARCH: {
    USERS: (userId, query, limit, page) => {
      const userParam = userId !== undefined ? `request_user=${userId}&` : '';
      return createEndpoint(
        `search/users?${userParam}query=${query}&_limit=${limit}&_page=${page}`,
      );
    },
    POSTS: (userId, query, limit, page) => {
      const userParam = userId !== undefined ? `request_user=${userId}&` : '';
      return createEndpoint(
        `search/posts?${userParam}query=${query}&_limit=${limit}&_page=${page}`,
      );
    },
  },
  BAD_WORD: {
    GET: createEndpoint('bad-word'),
    CREATE: createEndpoint('bad-word/add'),
    DELETE: (id) => createEndpoint(`bad-word/delete/${id}`),
    UPDATE: (id) => createEndpoint(`bad-word/update/${id}`),
    CHECK: (word) => createEndpoint(`bad-word/check-exists?word=${word}`),
  },
  // zalo pay
  ZALO_PAY: {
    CREATE_ORDER: createEndpoint('zalopay/payment'),
    CHECK_STATUS: createEndpoint('zalopay/check-status'),
  },
  TRANSACTION: {
    GET_ALL: (type) => createEndpoint(`transaction?type=${type}`),
    GET_BY_ID: (id) => createEndpoint(`transaction/${id}`),
    GET_BY_USER: (user_id) =>
      createEndpoint(`transaction/user?request_user=${user_id}`),
    GET_BY_RECEIPIENT: (recipient_id) =>
      createEndpoint(`transaction/recipient?request_user=${recipient_id}`),
    GET_ALL_OF_USER: (user_id, type) =>
      createEndpoint(
        `transaction/user/all-transactions?request_user=${user_id}&type=${type}`,
      ),
    WITHDRAWAL: (user_id) =>
      createEndpoint(`transaction/withdrawal?request_user=${user_id}`),
    CONFIRM_WITHDRAWAL: createEndpoint('transaction/withdrawal/confirm'),
  },
};
