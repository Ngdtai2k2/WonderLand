const router = require("express").Router();
const authController = require("../controllers/auth.controller");
const verifyMiddleware = require("../middleware/verifyToken");

router.post("/register", authController.registerUser);
router.post("/login", authController.loginUser);
router.post("/refresh/:id/:device", authController.requestRefreshToken);
router.post("/logout", verifyMiddleware.token, authController.logoutUser);
router.put(
  "/password/:id",
  verifyMiddleware.verifyTokenAndUserAuthorization,
  authController.changePassword
);
router.post("/forgot-password", authController.requestResetPassword);
router.post("/reset-password", authController.resetPassword);
router.post("/check-nickname", authController.checkUniqueNickname);

module.exports = router;
