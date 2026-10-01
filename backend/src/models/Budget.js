import mongoose from "mongoose";

const budgetSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        categoryId: { type: String, required: true },
        limitAmount: { type: Number, required: true },
        startDate: { type: String, required: true },
        endDate: { type: String, required: true },
        recurring: {
            type: String,
            enum: ["none", "daily", "weekly", "biweekly", "monthly", "yearly"],
            default: "none",
        },
        alertThreshold: { type: Number, default: 0.8 },
    },
    { timestamps: true }
);

export default mongoose.model("Budget", budgetSchema);
