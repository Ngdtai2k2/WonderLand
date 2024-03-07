const router = require("express").Router();

const cloudinary = require("../configs/cloudinary");
const storage = require("../configs/multer");


router.post("/upload/video", storage.single("video"), async (req, res) => {
  try {
    const data = await cloudinary.uploader.upload(req.file.path, {
      resource_type: "video",
    });
    res.status(200).json({ url: data.secure_url });
  } catch (error) {
    res.status(500).json({ error: "Upload failed" });
  }
});

module.exports = router;
