const postPopulateOptions = require("../configs/constants");
const optionsPaginate = require("../configs/optionsPaginate");
const Post = require("../models/Post");
const SavePost = require("../models/SavePost");
const User = require("../models/User");
const reactionController = require("./reactionController");

const savePostController = {
  handleSavePost: async (req, res) => {
    try {
      const { user, id } = req.body;
      const post = await Post.findById(id);
      if (!post) return res.status(404).json({ message: "Post not found!" });
      const savePost = await SavePost.findOne({
        user,
        postId: id,
      });

      if (!savePost) {
        await SavePost.create({
          user: user,
          postId: id,
        });
        return res.status(201).json({ message: "Post saved!", state: true });
      }
      await SavePost.findOneAndDelete(savePost._id);
      return res.status(200).json({ message: "Post unsaved!", state: false });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

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

  getSavedPost: async (req, res) => {
    try {
      const { userId } = req.body;
      if (!userId) {
        return res
          .status(404)
          .json({ message: "Please provide your User ID!" });
      }
      const options = optionsPaginate(req);

      const result = await SavePost.paginate({ user: userId }, options);
      await SavePost.populate(result.docs, { path: "postId" });

      result.docs = await Promise.all(
        result.docs.map(async (savedPost) => {
          const postId = savedPost.postId;
          let hasReacted = null;
          let hasSavedPost = null;
          const user = await User.findById(userId);
          if (!user) {
            return res.status(404).json({ message: "User not found!" });
          }
          hasReacted = await reactionController.hasReactionPost(user, postId);
          hasSavedPost = await savePostController.hasSavePost(user, postId);

          const totalReaction = await reactionController.countReactions(
            postId,
            null
          );
          const updatedSavedPost = {
            ...postId.toObject(),
            hasReacted,
            hasSavedPost,
            totalReaction,
          };

          return (savedPost = await Post.populate(
            updatedSavedPost,
            postPopulateOptions
          ));
        })
      );
      return res.status(200).json({ result });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "An error occurred please try again later!" });
    }
  },
};

module.exports = savePostController;