import mongoose from "mongoose"


const walletSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    name: {
      type: String,
      required: true,
      trim: true
    },

    icon: {
      type: String,
      default: "account_balance_wallet"
    },

    currency: {
      type: String,
      default: "ETB",
      uppercase: true,
      trim: true
    },

    isDefault: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model("Wallet", walletSchema);