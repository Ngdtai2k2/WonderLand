const router = require("express").Router();
const userController = require("../controllers/userController");
const verifyMiddleware = require("../middleware/verifyToken");
const storage = require("../configs/multer");

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

module.exports = router;
