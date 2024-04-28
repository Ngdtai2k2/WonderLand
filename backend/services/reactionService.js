const Reaction = require("../models/Reaction");

const reactionService = {
  hasReactionPost: async (userId, postId) => {
    const reaction = await Reaction.findOne({
      author: userId,
      postId: postId,
    });
    if (!reaction) {
      return null;
    }
    return reaction.type;
  },
  
  countReactions: async (postId, commentId) => {
    try {
      const query = commentId ? { commentId } : { postId };
      const reactions = await Reaction.countDocuments({ ...query, type: { $in: [0, 1] } });
      return reactions;
    } catch (error) {
      return null;
    }
  },
};

module.exports = reactionService;
