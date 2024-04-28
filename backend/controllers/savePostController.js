const Post = require("../models/Post");
const SavePost = require("../models/SavePost");

const savePostController = {
  handleSavePost: async (req, res) => {
    try {
      const { author, id, type } = req.body;
      const post = await Post.findById(id);
      if (!post) return res.status(404).json({ message: "Post not found!" });
      const savePost = await SavePost.findOne({
        author,
        postId: id,
      });
      if (savePost) {
        if (savePost.type == type) {
          await SavePost.findOneAndDelete(savePost._id);
          return res.status(200).json({ message: "Post unsaved!" });
        } else {
          await SavePost.findByIdAndUpdate(
            {
              _id: savePost._id,
            },
            {
              type: type,
            },
            {
              new: true,
            }
          );
          return res.status(201).json({ message: "Post saved!" });
        }
      } else {
        await SavePost.create({
          author: author,
          type: type,
          postId: id,
        });
        return res.status(201).json({ message: "Post saved!" });
      }
    } catch (error) {
      return res
        .status(500)
        .json({ message: "An error occurred please try again later!" });
    }
  },
  hasSavePost: async (author, id) => {
    const savePost = await SavePost.findOne({
      author: author,
      postId: id,
    });
    if (!savePost) {
      return null;
    }
    return savePost.type;
},
};

module.exports = savePostController;
