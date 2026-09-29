import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    wallet: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Wallet",
      required: true,
      index: true
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
      index: true
    },

    amount: {
      type: Number,
      required: true,
      min: 0.01
    },

    type: {
      type: String,
      enum: ["DEBIT", "CREDIT"],
      required: true
    },

    note: {
      type: String,
      trim: true,
      maxlength: 500
    },

    date: {
      type: Date,
      required: true,
      index: true
    },

    status: {
      type: String,
      enum: ["PENDING", "CLEARED", "CANCELLED"],
      default: "CLEARED"
    }
  },
  {
    timestamps: true
  }
);

transactionSchema.index({
  user: 1,
  date: -1
});

export default mongoose.model("Transaction", transactionSchema);