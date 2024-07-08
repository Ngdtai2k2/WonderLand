const router = require("express").Router();
const transactionController = require("../controllers/transaction.controller");
const verifyMiddleware = require("../middleware/verifyToken");

router.get(
  "/recipient",
  verifyMiddleware.verifyTokenAndUserAuthorization,
  transactionController.getAllTransactionsByRecipient
);
router.get(
  "/user",
  verifyMiddleware.verifyTokenAndUserAuthorization,
  transactionController.getAllTransactionsByUser
);
router.get(
  "/",
  verifyMiddleware.tokenAndAdminAuth,
  transactionController.getAllTransactions
);
router.get(
  "/:id",
  verifyMiddleware.token,
  transactionController.getTransactionById
);
router.get(
  "/user/all-transactions",
  verifyMiddleware.verifyTokenAndUserAuthorization,
  transactionController.getAllTransactionsOfUser
);

module.exports = router;
