const router = require("express").Router();

const verifyMiddleware = require("../middleware/verifyToken");
const postController = require("../controllers/postController");
const storage = require("../configs/multer");

// type query: 0 - top, 1 - trend, 2 - fresh, 3 - ask, 4 - no type
router.post("/:typeQuery", postController.getAllPost);
router.get("/:id", postController.getPostById);
router.post(
  "/create",
  verifyMiddleware.token,
  storage.single("file"),
  postController.createPost
);

module.exports = router;
