const router = require("express").Router();
const authController = require("../controllers/authController");
const verifyMiddleware = require("../middleware/verifyToken");

router.post("/register", authController.registerUser);
router.post("/login", authController.loginUser);
router.post("/refresh/:id", authController.requestRefreshToken);
router.post("/logout", authController.logoutUser);
router.put(
  "/password/:id",
  verifyMiddleware.verifyTokenAndUserAuthorization,
  authController.changePassword
);

module.exports = router;
