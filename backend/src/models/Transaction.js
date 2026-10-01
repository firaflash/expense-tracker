import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        amount: { type: Number, required: true },
        type: { type: String, enum: ["CREDIT", "DEBIT"], required: true },
        categoryId: { type: String, required: true },
        note: { type: String, default: "" },
        date: { type: String, required: true },
        status: {
            type: String,
            enum: ["PENDING", "CLEARED"],
            default: "CLEARED",
        },
        walletId: { type: String, default: "wallet-main" },
    },
    { timestamps: true }
);

export default mongoose.model("Transaction", transactionSchema);
