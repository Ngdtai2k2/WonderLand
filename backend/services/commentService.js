const Comments = require("../models/Comments");

const commentService = {
  count: async (postId) => {
      const totalComment = await Comments.countDocuments({ postId: postId });
      return totalComment ? totalComment : 0 ;
  },
};

module.exports = commentService;
