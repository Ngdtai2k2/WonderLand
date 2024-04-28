const router = require("express").Router();
const verifyMiddleware = require("../middleware/verifyToken");
const reactionController = require("../controllers/reactionController");

router.post("/like", verifyMiddleware.token, reactionController.handleLikePost);
router.post("/post", reactionController.getPostUserReacted);

module.exports = router;
