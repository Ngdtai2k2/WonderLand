const router = require("express").Router();
const userController = require("../controllers/user.controller");
const verifyMiddleware = require("../middleware/verifyToken");
const storage = require("../configs/multer.config");
const postController = require("../controllers/post.controller");

router.post("/post", postController.getAllPostByUserId);
router.get("/:user", userController.findUserById);
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
router.post(
  "/",
  verifyMiddleware.tokenAndAdminAuth,
  userController.getAllUsers
);
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
router.put(
  "/media-update/:userId",
  verifyMiddleware.verifyTokenAndUserAuthorization,
  storage.single("file"),
  userController.updateMediaProfile
);

module.exports = router;
