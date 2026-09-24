// src/server.js
import app from './app.js';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
dotenv.config();

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    console.log(`🔌 Connecting to MongoDB...`);
    await connectDB();
    console.log('✅ MongoDB Connected Successfully');

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`   http://localhost:${PORT}/api/health`);
    });
  } catch (err) {
    console.error('❌ Failed to start server:', err.message);
    process.exit(1);
  }
};

startServer();