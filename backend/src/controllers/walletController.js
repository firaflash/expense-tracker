import Wallet from "../models/Wallet.js";

// CREATE WALLET
export const createWallet = async (req, res) => {
  try {
    const { name, icon, currency, isDefault } = req.body;

    if (!name) {
      return res.status(400).json({
        message: "Wallet name is required",
      });
    }

    const wallet = await Wallet.create({
      user: req.user._id,
      name,
      icon,
      currency,
      isDefault,
    });

    return res.status(201).json(wallet);
  } catch (error) {
    console.error("CREATE WALLET ERROR:", error);

    return res.status(500).json({
      message: "Server error while creating wallet",
    });
  }
};

// GET ALL WALLETS
export const getWallets = async (req, res) => {
  try {
    const wallets = await Wallet.find({
      user: req.user._id,
    }).sort({ createdAt: -1 });

    return res.status(200).json(wallets);
  } catch (error) {
    console.error("GET WALLETS ERROR:", error);

    return res.status(500).json({
      message: "Server error while fetching wallets",
    });
  }
};

// GET ONE WALLET
export const getWallet = async (req, res) => {
  try {
    const wallet = await Wallet.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!wallet) {
      return res.status(404).json({
        message: "Wallet not found",
      });
    }

    return res.status(200).json(wallet);
  } catch (error) {
    console.error("GET WALLET ERROR:", error);

    return res.status(500).json({
      message: "Server error while fetching wallet",
    });
  }
};

// UPDATE WALLET
export const updateWallet = async (req, res) => {
  try {
    const allowedFields = [
      "name",
      "icon",
      "currency",
      "isDefault",
    ];

    const updates = {};

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    const wallet = await Wallet.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!wallet) {
      return res.status(404).json({
        message: "Wallet not found",
      });
    }

    Object.assign(wallet, updates);

    const updatedWallet = await wallet.save();

    return res.status(200).json(updatedWallet);
  } catch (error) {
    console.error("UPDATE WALLET ERROR:", error);

    return res.status(500).json({
      message: "Server error while updating wallet",
    });
  }
};

// DELETE WALLET
export const deleteWallet = async (req, res) => {
  try {
    const wallet = await Wallet.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!wallet) {
      return res.status(404).json({
        message: "Wallet not found",
      });
    }

    return res.status(200).json({
      message: "Wallet deleted successfully",
    });
  } catch (error) {
    console.error("DELETE WALLET ERROR:", error);

    return res.status(500).json({
      message: "Server error while deleting wallet",
    });
  }
};