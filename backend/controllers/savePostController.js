const Post = require("../models/Post");
const SavePost = require("../models/SavePost");

const savePostController = {
  handleSavePost: async (req, res) => {
    try {
      const { author, id } = req.body;
      const post = await Post.findById(id);
      if (!post) return res.status(404).json({ message: "Post not found!" });
      const savePost = await SavePost.findOne({
        author,
        postId: id,
      });

      if (!savePost) {
        await SavePost.create({
          author: author,
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
  hasSavePost: async (author, id) => {
    const savePost = await SavePost.findOne({
      author: author,
      postId: id,
    });
    if (!savePost) {
      return false;
    }
    return true;
  },
};

module.exports = savePostController;
