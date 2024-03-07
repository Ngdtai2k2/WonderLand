const cloudinary = require("../configs/cloudinary");
const mediaController = require("../controllers/mediaController");

const uploadMedia = {
  uploadImage: async (req, res) => {
    try {
      const data = await cloudinary.uploader.upload(req.file.path);
      const { secure_url, public_id } = data;
      const newMedia = await mediaController.createMedia({
        url: secure_url,
        type: 0,
        description: req.body.description,
        cloudinary_id: public_id,
      });
      return newMedia;
    } catch (error) {
      return null;
    }
  },
};

module.exports = uploadMedia;