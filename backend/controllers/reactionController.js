const postPopulateOptions = require("../configs/constants");
const optionsPaginate = require("../configs/optionsPaginate");
const Post = require("../models/Post");
const Reaction = require("../models/Reaction");
const User = require("../models/User");
const reactionService = require("../services/reactionService");
const savePostService = require("../services/savePostService");

const reactionController = {
  handleLikePost: async (req, res) => {
    try {
      const { id, author, type } = req.body;

      const post = await Post.findById(id);

      if (!post) {
        return res.status(404).json({ message: "Post not found!" });
      }

      const reaction = await Reaction.findOne({
        author,
        postId: id,
      });

      if (reaction) {
        if (reaction.type == type) {
          await Reaction.findOneAndDelete(reaction._id);
          return res.status(200).json({ removed: true });
        } else {
          await Reaction.findOneAndUpdate(
            { _id: reaction._id },
            {
              type: type,
            },
            {
              new: true,
            }
          );
          return res.status(200).json({ message: "Reaction updated!" });
        }
      } else {
        await Reaction.create({
          author:author,
          type: type,
          postId: id,
        });
        return res.status(201).json({ message: "Reaction saved!" });
      }
    } catch (error) {
      return res
        .status(500)
        .json({ message: "An error occurred please try again later!" });
    }
  },

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

  getPostUserReacted: async (req, res) => {
    try {
      const { userId } = req.body;
      if (!userId) {
        return res
          .status(404)
          .json({ message: "Please provide your User ID!" });
      }
      const options = optionsPaginate(req);

      const result = await Reaction.paginate({ author: userId }, options);
      await Reaction.populate(result.docs, { path: "postId" });

      result.docs = await Promise.all(
        result.docs.map(async (reactionPost) => {
          const postId = reactionPost.postId;
          let hasReacted = null;
          let hasSavedPost = null;
          const user = await User.findById(userId);
          if (!user)
            return res.status(404).json({ message: "User not found!" });
          
          hasReacted = await reactionService.hasReactionPost(userId, postId);
          hasSavedPost = await savePostService.hasSavePost(userId, postId);

          const totalReaction = await reactionService.countReactions(
            postId,
            null
          );
          const updatedSavedPost = {
            ...postId.toObject(),
            hasReacted,
            hasSavedPost,
            totalReaction,
          };

          return (reactionPost = await Post.populate(
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
  }
};

module.exports = reactionController;
