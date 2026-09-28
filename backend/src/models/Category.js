import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
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
      default: "category"
    },

    color: {
      type: String,
      default: "#6366f1"
    },

    type: {
      type: String,
      enum: ["EXPENSE", "INCOME", "BOTH"],
      default: "EXPENSE"
    }
  },
  {
    timestamps: true
  }
);

categorySchema.index(
  { user: 1, name: 1 },
  { unique: true }
);

export default mongoose.model("Category", categorySchema);