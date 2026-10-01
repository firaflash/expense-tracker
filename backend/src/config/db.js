import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  try {
    const URL = process.env.MONGODB_URI;

    if (!URL) {
      throw new Error("MONGODB_URI is not defined");
    }

    console.log("🔌 Connecting to MongoDB...");

    const conn = await mongoose.connect(URL);

    console.log(
      `✅ MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`
    );

    console.log("Mongoose readyState:", mongoose.connection.readyState);

    return conn;
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error);
    throw error;
  }
};

export default connectDB;