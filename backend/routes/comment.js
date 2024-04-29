const router = require("express").Router();
const verifyMiddleware = require("../middleware/verifyToken");
const storage = require("../configs/multer");
const commentController = require("../controllers/commentController");

router.post(
  "/create",
  verifyMiddleware.token,
  storage.single("file"),
  commentController.create
);
router.post(
  "/:id/reply",
  verifyMiddleware.token,
  storage.single("file"),
  commentController.replyComment
);
router.get("/post/:id", commentController.getCommentsByPostId);
router.delete("/:id", verifyMiddleware.verifyTokenAndUserAuthorization, commentController.delete);

module.exports = router;
