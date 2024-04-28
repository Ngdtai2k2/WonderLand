const Post = require("../models/Post");
const Reaction = require("../models/Reaction");
const Comments = require("../models/Comments");

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
  hasReactionPost: async (author, postId) => {
      const reaction = await Reaction.findOne({
        author: author,
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

module.exports = reactionController;
