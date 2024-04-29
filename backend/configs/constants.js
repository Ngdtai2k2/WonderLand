const postPopulateOptions = [
  {
    path: "author",
    select: "id fullname",
    populate: {
      path: "media",
      model: "Media",
      select: "url",
    },
  },
  { path: "media", select: "url type" },
  {
    path: "category",
    select: "name",
    populate: {
      path: "media",
      model: "Media",
      select: "url",
    },
  },
];

const commentPopulateOptions = [
  {
    path: "author",
    select: "id fullname",
    populate: {
      path: "media",
      model: "Media",
      select: "url",
    },
  },
  {
    path: "media",
    model: "Media",
    select: "url type",
  },
  {
    path: "parentCommentId",
    populate: {
      path: "media",
      model: "Media",
      select: "url",
    },
  },
];

module.exports = { postPopulateOptions, commentPopulateOptions };
