const router = require("express").Router();
const verifyMiddleware = require("../middleware/verifyToken");
const reactionController = require("../controllers/reaction.controller");

router.post("/like", verifyMiddleware.token, reactionController.handleLikePost);
router.post("/post", reactionController.getPostUserReacted);
router.post("/comment/like", verifyMiddleware.token, reactionController.handleLikeComment);
router.post("/reply/like", verifyMiddleware.token, reactionController.handleLikeReply);

module.exports = router;
