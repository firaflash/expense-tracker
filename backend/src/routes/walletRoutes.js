import express from "express";

import {
  createWallet,
  getWallets,
  getWallet,
  updateWallet,
  deleteWallet,
} from "../controllers/walletController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.get("/", getWallets);
router.post("/", createWallet);
router.get("/:id", getWallet);
router.put("/:id", updateWallet);
router.delete("/:id", deleteWallet);

export default router;