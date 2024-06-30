const router = require("express").Router();
const transactionController = require("../controllers/transaction.controller");
const verifyMiddleware = require("../middleware/verifyToken");

router.get("/", verifyMiddleware.tokenAndAdminAuth, transactionController.getAllTransactions);
router.get(
  "/:id",
  verifyMiddleware.token,
  transactionController.getTransactionById
);
router.get(
  "/recipient/:recipientId",
  verifyMiddleware.verifyTokenAndUserAuthorization,
  transactionController.getAllTransactionsByRecipient
);
router.get(
  "/user/:userId",
  verifyMiddleware.verifyTokenAndUserAuthorization,
  transactionController.getAllTransactionsByUser
);

module.exports = router;
