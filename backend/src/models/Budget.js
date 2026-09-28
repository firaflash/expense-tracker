import mongoose from "mongoose";

const budgetSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true
    },

    limitAmount: {
      type: Number,
      required: true,
      min: 0
    },

    startDate: {
      type: Date,
      required: true
    },

    endDate: {
      type: Date,
      required: true
    },

    recurring: {
      type: String,
      enum: ["none", "monthly", "weekly", "yearly"],
      default: "none"
    },

    alertThreshold: {
      type: Number,
      min: 0,
      max: 1,
      default: 0.8
    }
  },
  {
    timestamps: true
  }
);

budgetSchema.index({
  user: 1,
  category: 1,
  startDate: 1,
  endDate: 1
});

export default mongoose.model("Budget", budgetSchema);