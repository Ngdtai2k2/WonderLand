const Comments = require("../models/comment.model");

const commentService = {
  count: async (postId) => {
    const totalComments = await Comments.countDocuments({ postId: postId });
    const totalReplies = await Comments.aggregate([
      { $match: { postId: postId } },
      { $project: { repliesCount: { $size: "$replies" } } },
      { $group: { _id: null, totalReplies: { $sum: "$repliesCount" } } }
    ]);
    const totalRepliesCount = totalReplies.length > 0 ? totalReplies[0].totalReplies : 0;
    const totalCount = totalComments + totalRepliesCount;

    return totalCount ? totalCount : 0 ;
  },
};

module.exports = commentService;
