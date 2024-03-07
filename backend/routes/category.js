const router = require("express").Router();
const verifyMiddleware = require("../middleware/verifyToken");
const categoriesController = require("../controllers/categoriesController");

const verifyTokenAndAdminAuth = verifyMiddleware.tokenAndAdminAuth;

router.get("/", categoriesController.getAllCategories);
router.post(
  "/create",
  verifyTokenAndAdminAuth,
  categoriesController.createCategory
);
router.put(
  "/update/:id",
  verifyTokenAndAdminAuth,
  categoriesController.updateCategory
);
router.delete(
  "/delete/:id",
  verifyTokenAndAdminAuth,
  categoriesController.deleteCategory
);

module.exports = router;
