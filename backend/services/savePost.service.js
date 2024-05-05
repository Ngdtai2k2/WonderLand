const SavePost = require("../models/savePost.model");

const savePostService = {
  hasSavePost: async (userId, postId) => {
    const savePost = await SavePost.findOne({
      user: userId,
      postId: postId,
    });
    if (!savePost) {
      return false;
    }
    return true;
  },
};

module.exports = savePostService;
