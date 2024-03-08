const Media = require("../models/Media");

const mediaController = {
  createMedia: async (req, res) => {
    try {
      const { url, type, description, cloudinary_id } = req;

      const newMedia = new Media({
        url: url,
        type: type,
        description: description,
        cloudinary_id: cloudinary_id,
      });

      const media = await newMedia.save();
      return media;
    } catch (error) {
      console.error(error);
    }
  },

  updateMedia: async (req, res, media) => {
    try {
      const { url, type, description, cloudinary_id } = req.body.media;

      const updatedMedia = await Media.findByIdAndUpdate(media, {
        url: url,
        type: type,
        description: description,
        cloudinary_id: cloudinary_id,
      });

      return updatedMedia;
    } catch (error) {
      console.error(error);
    }
  },

  deleteMedia: async (req, res, media) => {
    try {
      await Media.findByIdAndDelete(media);
      return true;
    } catch (error) {
      return false;
    }
  },
};

module.exports = mediaController;
