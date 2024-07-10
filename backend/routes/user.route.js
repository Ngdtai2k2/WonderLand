const router = require("express").Router();
const userController = require("../controllers/user.controller");
const verifyMiddleware = require("../middleware/verifyToken");
const storage = require("../configs/multer.config");
const postController = require("../controllers/post.controller");

// Route cụ thể hơn trước
router.get(
  "/balance",
  verifyMiddleware.verifyTokenAndUserAuthorization,
  userController.getBalanceByUser
);
router.put(
  "/media-update",
  verifyMiddleware.verifyTokenAndUserAuthorization,
  storage.single("file"),
  userController.updateMediaProfile
);
router.delete(
  "/:id",
  verifyMiddleware.verifyTokenAndUserAuthorization,
  userController.deleteUserById
);
router.put(
  "/:id",
  verifyMiddleware.verifyTokenAndUserAuthorization,
  storage.single("file"),
  userController.updateUserById
);
router.post("/post", postController.getAllPostByUserId);
router.post(
  "/total",
  verifyMiddleware.tokenAndAdminAuth,
  userController.countUser
);
router.post(
  "/today",
  verifyMiddleware.tokenAndAdminAuth,
  userController.getNewUser
);
router.post(
  "/",
  verifyMiddleware.tokenAndAdminAuth,
  userController.getAllUsers
);
router.post("/:user", userController.findUserById);

module.exports = router;
