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
  
  module.exports = postPopulateOptions;
  