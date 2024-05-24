const router = require("express").Router();
const verifyMiddleware = require("../middleware/verifyToken");
const friendsController = require("../controllers/friends.controller");

router.post("/send-request", verifyMiddleware.token, friendsController.request);
router.post(
  "/cancel-request",
  verifyMiddleware.token,
  friendsController.cancelRequest
);
router.post(
  "/accept-request",
  verifyMiddleware.token,
  friendsController.acceptRequest
);
router.post(
  "/delete-friend",
  verifyMiddleware.token,
  friendsController.deleteFriend
);

module.exports = router;
