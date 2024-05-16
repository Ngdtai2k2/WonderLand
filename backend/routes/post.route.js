const router = require("express").Router();

const verifyMiddleware = require("../middleware/verifyToken");
const postController = require("../controllers/post.controller");
const storage = require("../configs/multer.config");

router.post("/view", postController.viewPost);
router.post(
  "/create",
  verifyMiddleware.token,
  storage.single("file"),
  postController.create
);
// type query: 0 - top, 1 - trend, 2 - fresh, 3 - ask, 4 - no type
router.post("/:typeQuery", postController.getAllPost);
router.post("/d/:id", postController.getPostById);
router.post("/category/:category", postController.getPostByCategory);
router.delete(
  "/delete/:id/report",
  verifyMiddleware.tokenAndAdminAuth,
  postController.deletePostReport
);
router.delete(
  "/delete/:id",
  verifyMiddleware.verifyTokenAndUserAuthorization,
  postController.delete
);

module.exports = router;
