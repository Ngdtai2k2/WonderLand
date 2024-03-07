function createOptions(req, additionalSelects = "") {
  const {
    _page = 1,
    _limit = 10,
    _sort = "createdAt",
    _order = "asc",
  } = req.query;

  return {
    page: _page,
    limit: _limit,
    sort: {
      [_sort]: _order === "asc" ? 1 : -1,
    },
    order: _order,
    select: `${additionalSelects}`,
  };
}

module.exports = createOptions;
