const router = require("express").Router();
const verifyMiddleware = require("../middleware/verifyToken");
const socketController = require("../controllers/socket.controller");

router.post("/online", verifyMiddleware.token, socketController.checkOnline);
router.post("/online/:userId", verifyMiddleware.token, socketController.checkOnlineByUser)

module.exports = router;
