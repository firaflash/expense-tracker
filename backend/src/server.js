import mongoose from "mongoose";
import dotenv from "dotenv";
import app from "./app.js";

dotenv.config();

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGODB_URI;



const startServer = async () => {
  console.log("Starting server...", `PORT: ${PORT}`, `MONGO_URI: ${MONGO_URI}`);
  try{
    mongoose
      .connect(MONGO_URI )
      .then(() => {
        console.log("✅ MongoDB Connected Successfully");
        app.listen(PORT, () => {
          console.log(`🚀 Server running on port ${PORT}`);
        });
      })
      .catch((err) => {
        console.error("❌ MongoDB Connection Error:", err);
        process.exit(1);
      });
  }catch(err){
    console.error("❌ Server Error:", err);
    process.exit(1);
  }


}
export default startServer;