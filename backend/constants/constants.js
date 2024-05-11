const postPopulateOptions = [
  {
    path: "author",
    select: "_id fullname nickname",
    populate: {
      path: "media",
      model: "Media",
      select: "url type",
    },
  },
  { path: "media", select: "url type" },
  {
    path: "category",
    select: "name",
    populate: {
      path: "media",
      model: "Media",
      select: "url type",
    },
  },
];

const commentPopulateOptions = [
  {
    path: "author",
    select: "_id fullname nickname",
    populate: {
      path: "media",
      model: "Media",
      select: "url type",
    },
  },
  {
    path: "media",
    model: "Media",
    select: "url type",
  },
  {
    path: "replies",
    populate: [
      {
        path: "author",
        select: "_id fullname nickname",
        populate: {
          path: "media",
          model: "Media",
          select: "url type",
        },
      },
      {
        path: "media",
        model: "Media",
        select: "url type",
      },
    ],
  },
];

const reportPopulateOptions = [
  {
    path: "user",
    select: "_id nickname",
    populate: {
      path: "media",
      select: "url type",
    },
  },
  {
    path: "post",
    select: "_id title content",
    populate: {
      path: "media",
      select: "url type",
    },
  },
  {
    path: "comment",
    select: "_id content",
    populate: {
      path: "media",
      select: "url type",
    },
  },
  {
    path: "rule",
    select: "_id name description",
  },
];

module.exports = {
  postPopulateOptions,
  commentPopulateOptions,
  reportPopulateOptions,
};
