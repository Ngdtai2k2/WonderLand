const { commentPopulateOptions } = require("../configs/constants");
const optionsPaginate = require("../configs/optionsPaginate");
const Comments = require("../models/Comments");
const uploadMediaController = require("./uploadMediaController");

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
          data = await uploadMediaController.uploadImage(req, res);

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
      return res
        .status(200)
        .json({
          message: "Comment has been created!",
          newComment: dataNewComment,
        });
    } catch (error) {
      return res.status(500).json({ error });
    }
  },
  replyComment: async (req, res) => {
    try {
      const { content, author, postId } = req.body;
      const { id } = req.params;

      let data;
      if (req.file) {
        if (req.file.mimetype.startsWith("image/"))
          data = await uploadMediaController.uploadImage(req, res);

        if (data === null)
          return res.status(400).json({ message: "Upload image failed!" });
      }

      const newComment = new Comments({
        postId: postId,
        author: author,
        content: content,
        media: req.file ? data._id : null,
        parentCommentId: id,
      });

      await newComment.save();
      return res.status(200).json({ message: "Comment has been created!" });
    } catch (error) {
      return res.status(500).json({ error });
    }
  },
  getCommentsByPostId: async (req, res) => {
    try {
      const { id } = req.params;
      const options = optionsPaginate(req);
      let result = await Comments.paginate({ postId: id }, options);
      result.docs = await Promise.all(
        result.docs.map(async (comment) => {
          return await Comments.populate(comment, commentPopulateOptions);
        })
      );
      return res.status(200).json({ result });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "An error occurred please try again later!" });
    }
  },
  delete: async (req, res) => {
    try {
      const { id } = req.params;
      const comments = await Comments.findById(id).populate("media");
      if (comments?.media) {
        if (
          !(await uploadMediaController.deleteFile(
            comments.media.cloudinary_id
          ))
        ) {
          return res
            .status(400)
            .json({ message: "An error occurred, please try again later!" });
        }
      }
      await Comments.findByIdAndDelete(id);
      return res.status(200).json({ message: "Comment has been deleted!" });
    } catch (error) {
      console.error(error.message);
      return res
        .status(500)
        .json({ message: "An error occurred please try again later!" });
    }
  },
};

module.exports = commentController;
