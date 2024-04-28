const router = require("express").Router();

const verifyMiddleware = require("../middleware/verifyToken");
const postController = require("../controllers/postController");
const storage = require("../configs/multer");

router.post("/", postController.getAllPost);
router.get("/:id", postController.getPostWithMediaById);
router.post(
  "/create",
  verifyMiddleware.token,
  storage.single("file"),
  postController.createPost
);

module.exports = router;
