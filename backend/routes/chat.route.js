const router = require("express").Router();
const verifyMiddleware = require("../middleware/verifyToken");
const chatController = require("../controllers/chat.controller");

router.post("/", verifyMiddleware.token, chatController.create);
router.get("/:userId", verifyMiddleware.token, chatController.userChats);
router.get(
  "/find/:firstId/:secondId",
  verifyMiddleware.token,
  chatController.findChat
);

module.exports = router;
