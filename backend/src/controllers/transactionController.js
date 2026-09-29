import mongoose from "mongoose";
import Transaction from "../models/Transaction.js";
import Wallet from "../models/Wallet.js";
import Category from "../models/Category.js";


// ============================================
// CREATE TRANSACTION
// POST /api/transactions
// ============================================
export const createTransaction = async (req, res) => {
  try {
    const {
      amount,
      type,
      category,
      wallet,
      note,
      date,
      status,
    } = req.body;

    // Required fields
    if (
      amount === undefined ||
      !type ||
      !category ||
      !wallet ||
      !date
    ) {
      return res.status(400).json({
        message: "Amount, type, category, wallet, and date are required",
      });
    }

    // Amount validation
    if (amount <= 0) {
      return res.status(400).json({
        message: "Amount must be greater than 0",
      });
    }

    // Validate wallet ID format
    if (!mongoose.Types.ObjectId.isValid(wallet)) {
      return res.status(400).json({
        message: "Invalid wallet ID",
      });
    }

    // Validate category ID format
    if (!mongoose.Types.ObjectId.isValid(category)) {
      return res.status(400).json({
        message: "Invalid category ID",
      });
    }

    // Make sure wallet belongs to logged-in user
    const walletExists = await Wallet.findOne({
      _id: wallet,
      user: req.user._id,
    });

    if (!walletExists) {
      return res.status(400).json({
        message: "Invalid wallet",
      });
    }

    // Make sure category belongs to logged-in user
    const categoryExists = await Category.findOne({
      _id: category,
      user: req.user._id,
    });

    if (!categoryExists) {
      return res.status(400).json({
        message: "Invalid category",
      });
    }

    // Create transaction
    const transaction = await Transaction.create({
      user: req.user._id,
      amount,
      type,
      category,
      wallet,
      note,
      date,
      status,
    });

    return res.status(201).json(transaction);

  } catch (error) {
    console.error("CREATE TRANSACTION ERROR:", error);

    return res.status(500).json({
      message: "Server error while creating transaction",
    });
  }
};


// ============================================
// GET ALL TRANSACTIONS
// GET /api/transactions
// ============================================
export const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({
      user: req.user._id,
    })
      .sort({ date: -1 })
      .populate("wallet", "name currency")
      .populate("category", "name icon color type");

    return res.status(200).json(transactions);

  } catch (error) {
    console.error("GET TRANSACTIONS ERROR:", error);

    return res.status(500).json({
      message: "Server error while fetching transactions",
    });
  }
};


// ============================================
// GET ONE TRANSACTION
// GET /api/transactions/:id
// ============================================
export const getTransaction = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate MongoDB ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid transaction ID",
      });
    }

    const transaction = await Transaction.findOne({
      _id: id,
      user: req.user._id,
    })
      .populate("wallet", "name currency")
      .populate("category", "name icon color type");

    if (!transaction) {
      return res.status(404).json({
        message: "Transaction not found",
      });
    }

    return res.status(200).json(transaction);

  } catch (error) {
    console.error("GET TRANSACTION ERROR:", error);

    return res.status(500).json({
      message: "Server error while fetching transaction",
    });
  }
};


// ============================================
// UPDATE TRANSACTION
// PUT /api/transactions/:id
// ============================================
export const updateTransaction = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate transaction ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid transaction ID",
      });
    }

    // Only allow these fields to be updated
    const allowedFields = [
      "amount",
      "type",
      "category",
      "wallet",
      "note",
      "date",
      "status",
    ];

    const updates = {};

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    // Make sure transaction belongs to logged-in user
    const transaction = await Transaction.findOne({
      _id: id,
      user: req.user._id,
    });

    if (!transaction) {
      return res.status(404).json({
        message: "Transaction not found",
      });
    }

    // Validate amount if being updated
    if (
      updates.amount !== undefined &&
      updates.amount <= 0
    ) {
      return res.status(400).json({
        message: "Amount must be greater than 0",
      });
    }

    // If wallet is being changed, verify ownership
    if (updates.wallet !== undefined) {
      if (!mongoose.Types.ObjectId.isValid(updates.wallet)) {
        return res.status(400).json({
          message: "Invalid wallet ID",
        });
      }

      const walletExists = await Wallet.findOne({
        _id: updates.wallet,
        user: req.user._id,
      });

      if (!walletExists) {
        return res.status(400).json({
          message: "Invalid wallet",
        });
      }
    }

    // If category is being changed, verify ownership
    if (updates.category !== undefined) {
      if (!mongoose.Types.ObjectId.isValid(updates.category)) {
        return res.status(400).json({
          message: "Invalid category ID",
        });
      }

      const categoryExists = await Category.findOne({
        _id: updates.category,
        user: req.user._id,
      });

      if (!categoryExists) {
        return res.status(400).json({
          message: "Invalid category",
        });
      }
    }

    // Apply updates
    Object.assign(transaction, updates);

    const updatedTransaction = await transaction.save();

    return res.status(200).json(updatedTransaction);

  } catch (error) {
    console.error("UPDATE TRANSACTION ERROR:", error);

    return res.status(500).json({
      message: "Server error while updating transaction",
    });
  }
};


// ============================================
// DELETE TRANSACTION
// DELETE /api/transactions/:id
// ============================================
export const deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate transaction ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid transaction ID",
      });
    }

    // Only delete if it belongs to logged-in user
    const transaction = await Transaction.findOneAndDelete({
      _id: id,
      user: req.user._id,
    });

    if (!transaction) {
      return res.status(404).json({
        message: "Transaction not found",
      });
    }

    return res.status(200).json({
      message: "Transaction deleted successfully",
    });

  } catch (error) {
    console.error("DELETE TRANSACTION ERROR:", error);

    return res.status(500).json({
      message: "Server error while deleting transaction",
    });
  }
};