const router = require("express").Router();
const verifyMiddleware = require("../middleware/verifyToken");
const reactionController = require("../controllers/reactionController");

router.post('/like', verifyMiddleware.token, reactionController.handleLikePost);

module.exports = router;