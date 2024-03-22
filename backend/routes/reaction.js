const router = require("express").Router();
const verifyMiddleware = require("../middleware/verifyToken");
const reactionController = require("../controllers/reactionController");

router.post('/', verifyMiddleware.token, reactionController.createReaction);
router.post('/delete', verifyMiddleware.token, reactionController.deleteReaction);
router.post('/count', reactionController.countReactions);
router.post('/check', verifyMiddleware.token, reactionController.checkReactionByUserId)

module.exports = router;