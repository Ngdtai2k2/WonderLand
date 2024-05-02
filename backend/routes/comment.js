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
router.put(
  "/:id/reply",
  verifyMiddleware.token,
  storage.single("fileReply"),
  commentController.replyComment
);
router.post("/post/:id", commentController.getCommentsByPostId);
router.post("/:id/reply", commentController.getReply);
// Provide User ID via Query when calling API delete
router.delete(
  "/:commentId/delete",
  verifyMiddleware.verifyTokenAndUserAuthorization,
  commentController.delete
);

router.delete(
  "/:commentId/delete-reply/:replyId",
  verifyMiddleware.verifyTokenAndUserAuthorization,
  commentController.deleteReply
);

module.exports = router;
