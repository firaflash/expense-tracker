import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import startServer from "./server.js";

const app = express();

const allowedOrigins = [
  'http://localhost:3000',      // web
  'http://localhost:8081',      // Expo web
  'http://localhost:19006',     // Expo web alt
  'exp://127.0.0.1:19000',      // Expo Go
  'exp://192.168.x.x:19000',    // Expo on device — replace with your LAN IP
  //ADD any other origins you want to allow here for the mobile experiacnce use grok to host your local server and add the ngrok url here
];

// middleware
app.use(  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error(`CORS blocked: ${origin}`));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));


app.use(express.json());

// routes
app.use("/api/auth", authRoutes);

// test route
app.get("/", (req, res) => {
  res.json({ message: "MoniVo API is running..." });
});

await startServer();

export default app;
