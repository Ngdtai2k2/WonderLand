const postPopulateOptions = [
  {
    path: "author",
    select: "id fullname nickname",
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
    select: "id fullname nickname",
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
        select: "id fullname nickname",
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

module.exports = { postPopulateOptions, commentPopulateOptions };
