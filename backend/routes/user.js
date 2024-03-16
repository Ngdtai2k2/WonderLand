const router = require("express").Router();
const userController = require("../controllers/userController");
const verifyMiddleware = require("../middleware/verifyToken");
const storage = require("../configs/multer");
const postController = require("../controllers/postController");

router.get("/", userController.getAllUsers);
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
router.get("/:id/post", postController.getAllPostByUserId);

module.exports = router;
