const cloudinary = require("../configs/cloudinary.config");
const mediaController = require("./media.controller");

const uploadMedia = {
  uploadImage: async (req, res) => {
    try {
      const data = await cloudinary.uploader.upload(req.file.path, {
        resource_type: "auto",
      });
      const { secure_url, public_id } = data;
      const newMedia = await mediaController.createMedia({
        url: secure_url,
        type: 0,
        description: req.body.description,
        cloudinary_id: public_id,
      });
      return newMedia || null;
    } catch (error) {
      return null;
    }
  },

  uploadVideo: async (req, res) => {
    try {
      const data = await cloudinary.uploader.upload(req.file.path, {
        resource_type: "video",
      });
      const { secure_url, public_id } = data;
      const newMedia = await mediaController.createMedia({
        url: secure_url,
        type: 1,
        description: req.body.description,
        cloudinary_id: public_id,
      });
      return newMedia || null;
    } catch (error) {
      return null;
    }
  },

  deleteFile: async (public_id, resource_type) => {
    try {
      await cloudinary.uploader.destroy(public_id, {
        resource_type: resource_type,
      });
      return true;
    } catch (error) {
      console.error("Error deleting file:", error);
      return false;
    }
  },
};

module.exports = uploadMedia;
