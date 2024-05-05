const { commentPopulateOptions } = require("../constants/constants");
const optionsPaginate = require("../configs/optionsPaginate");
const Comments = require("../models/comment.model");
const User = require("../models/user.model");
const reactionService = require("../services/reaction.service");
const uploadMediaCloudinary = require("./uploadMediaCloudinary.controller");

const commentController = {
  create: async (req, res) => {
    try {
      const { content, author, postId } = req.body;
      let data;
      if (!content && !req.file) {
        return res
          .status(400)
          .json({ message: "Comments must contain photos or text!" });
      }

      if (req.file) {
        if (req.file.mimetype.startsWith("image/"))
          data = await uploadMediaCloudinary.uploadImage(req, res);

        if (data === null)
          return res.status(400).json({ message: "Upload image failed!" });
      }

      const newComment = new Comments({
        postId: postId,
        author: author,
        content: content || null,
        media: req.file ? data._id : null,
      });

      await newComment.save();
      const dataNewComment = await Comments.findById(newComment?._id).populate(
        commentPopulateOptions
      );
      return res.status(200).json({
        message: "Comment has been created!",
        newComment: dataNewComment,
      });
    } catch (error) {
      return res.status(500).json({ error });
    }
  },

  delete: async (req, res) => {
    try {
      const { commentId } = req.params;
      const comments = await Comments.findById(commentId).populate("media");
      if (comments?.media) {
        if (
          !(await uploadMediaCloudinary.deleteFile(
            comments.media.cloudinary_id
          ))
        ) {
          return res
            .status(400)
            .json({ message: "An error occurred, please try again later!" });
        }
      }
      await Comments.findByIdAndDelete(commentId);
      return res.status(200).json({ message: "Comment has been deleted!" });
    } catch (error) {
      console.error(error.message);
      return res
        .status(500)
        .json({ message: "An error occurred please try again later!" });
    }
  },

  getCommentsByPostId: async (req, res) => {
    try {
      const { id } = req.params;
      const { userId } = req.body;

      const options = optionsPaginate(req);
      let result = await Comments.paginate({ postId: id }, options);

      result.docs = await Promise.all(
        result.docs.map(async (comment) => {
          if (userId) {
            const userData = await User.findById(userId);
            if (!userData)
              return res.status(400).json({ message: "User not found!" });
          }
          const totalLike = await reactionService.countReactionComment(
            "commentId",
            comment._id,
            true
          );
          const totalDislike = await reactionService.countReactionComment(
            "commentId",
            comment._id,
            false
          );
          const hasReacted = await reactionService.hasReactionComment(
            "commentId",
            userId,
            comment._id
          );
          const updatedComment = {
            ...comment.toObject(),
            hasReacted,
            totalLike,
            totalDislike,
          };

          return await Comments.populate(
            updatedComment,
            commentPopulateOptions
          );
        })
      );
      return res.status(200).json({ result });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "An error occurred please try again later!" });
    }
  },

  replyComment: async (req, res) => {
    try {
      const { content, author } = req.body;
      const { id } = req.params;

      const comment = await Comments.findById(id);
      if (!comment) {
        return res.status(400).json({ message: "Comment not found!" });
      }

      const user = await User.findById(author);
      if (!user) {
        return res.status(400).json({ message: "User not found!" });
      }
      let data;
      if (req.file) {
        if (req.file.mimetype.startsWith("image/"))
          data = await uploadMediaCloudinary.uploadImage(req, res);

        if (data === null)
          return res.status(400).json({ message: "Upload image failed!" });
      }

      const reply = {
        commentId: id,
        author: author,
        content: content,
        media: req.file ? data._id : null,
      };

      const newComment = await Comments.findByIdAndUpdate(
        { _id: id },
        { $push: { replies: reply } },
        { new: true }
      ).populate(commentPopulateOptions);

      return res.status(200).json({ message: "Comment has been created!", newComment: newComment.replies.pop() });
    } catch (error) {
      return res.status(500).json({ error });
    }
  },

  deleteReply: async (req, res) => {
    try {
      const { commentId, replyId } = req.params;
      const comment = await Comments.findById(commentId);

      if (!comment) {
        return res.status(400).json({ message: "Comment not found!" });
      }
      await Comments.findByIdAndUpdate(
        { _id: commentId },
        { $pull: { replies: { _id: replyId } } },
        { new: true }
      );
      return res
        .status(200)
        .json({ message: "Comment reply has been deleted!" });
    } catch (error) {
      console.error(error.message);
      return res
        .status(500)
        .json({ message: "An error occurred please try again later!" });
    }
  },

  getReply: async (req, res) => {
    try {
      const { _page, _limit } = req.query;
      const { id } = req.params;
      const { userId } = req.body;

      const comment = await Comments.findById(id);

      if (!comment) {
        return res.status(400).json({ message: "Comment not found!" });
      }

      const totalReplies = comment.replies.length;
      const totalPages = Math.ceil(totalReplies / _limit);
      const currentPage = parseInt(_page);
      const startIndex = (currentPage - 1) * _limit;
      const replies = comment.replies.slice(startIndex, startIndex + _limit);

      const hasNextPage = currentPage < totalPages;
      const hasPrevPage = currentPage > 1;

      const populatedReplies = await Comments.populate(replies, [
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
      ]);

      for (const reply of populatedReplies) {
        const totalLike = await reactionService.countReactionComment(
          "replyId",
          reply._id,
          true
        );
        const totalDislike = await reactionService.countReactionComment(
          "replyId",
          reply._id,
          false
        );
        let hasReacted;
        if (userId) {
          hasReacted = await reactionService.hasReactionComment(
            "replyId",
            userId,
            reply._id
          );
        }
        const replyObject = reply.toObject();
        replyObject.totalLike = totalLike;
        replyObject.totalDislike = totalDislike;
        replyObject.hasReacted = hasReacted;
        populatedReplies[populatedReplies.indexOf(reply)] = replyObject;
      }

      return res.status(200).json({
        replies: populatedReplies,
        totalReplies: totalReplies,
        totalPages: totalPages,
        currentPage: currentPage,
        hasNextPage: hasNextPage,
        hasPrevPage: hasPrevPage,
      });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "An error occurred please try again later!" });
    }
  },
};

module.exports = commentController;
