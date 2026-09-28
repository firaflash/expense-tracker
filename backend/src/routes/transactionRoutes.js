import express from "express";

const {
  createTransaction,
  getTransactions,
  getTransaction,
  updateTransaction,
  deleteTransaction
} = require("../controllers/transactionController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect);

router.get("/", getTransactions);
router.post("/", createTransaction);
router.get("/:id", getTransaction);
router.put("/:id", updateTransaction);
router.delete("/:id", deleteTransaction);

export default router;