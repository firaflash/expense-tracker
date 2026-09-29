import Transaction from "../models/Transaction.js";
import Wallet from "../models/Wallet.js";
import Category from "../models/Category.js";

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

    // Check required fields
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

    // Make sure the wallet belongs to the authenticated user
    const walletExists = await Wallet.findOne({
      _id: wallet,
      user: req.user._id,
    });

    if (!walletExists) {
      return res.status(400).json({
        message: "Invalid wallet",
      });
    }

    // Make sure the category belongs to the authenticated user
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