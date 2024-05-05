const router = require("express").Router();
const userController = require("../controllers/userController");
const verifyMiddleware = require("../middleware/verifyToken");
const storage = require("../configs/multer.config");
const postController = require("../controllers/postController");

router.post("/post", postController.getAllPostByUserId);
router.get("/:id", userController.findUserById);
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
router.post("/", verifyMiddleware.tokenAndAdminAuth, userController.getAllUsers);
router.post("/total", verifyMiddleware.tokenAndAdminAuth, userController.countUser);
router.post("/today", verifyMiddleware.tokenAndAdminAuth, userController.getNewUser);

module.exports = router;
