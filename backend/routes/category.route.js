const router = require("express").Router();
const verifyMiddleware = require("../middleware/verifyToken");
const categoriesController = require("../controllers/categories.controller");
const storage = require("../configs/multer.config");
const verifyTokenAndAdminAuth = verifyMiddleware.tokenAndAdminAuth;

router.get("/", categoriesController.getAllCategories);
router.post(
  "/create",
  verifyTokenAndAdminAuth,
  storage.single("file"),
  categoriesController.create
);
router.put(
  "/update/:id",
  verifyTokenAndAdminAuth,
  storage.single("file"),
  categoriesController.updateCategory
);
router.delete(
  "/delete/:id",
  verifyTokenAndAdminAuth,
  categoriesController.deleteCategory
);
router.post("/detail/:categoryId", categoriesController.getCategoryDetail);
router.post(
  "/like/:categoryId",
  verifyMiddleware.token,
  categoriesController.handleLikeCategory
);
router.post(
  "/follow/:categoryId",
  verifyMiddleware.token,
  categoriesController.handleFollowCategory
);
router.put(
  "/:categoryId/notifications/:userId",
  verifyMiddleware.token,
  categoriesController.changeIsNotificationAfterFollowCategory
);

module.exports = router;
