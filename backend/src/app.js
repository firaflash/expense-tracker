// src/app.js
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import transactionRoutes from './routes/transactionRoutes.js';
import walletRoutes from "./routes/walletRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";



const app = express();

// --- CORS ---
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:8081',
  'http://localhost:19006',
  'exp://127.0.0.1:19000',
  // add your ngrok URL here when sharing:
  // 'https://lantern-unwrapped-handshake.ngrok-free.dev',
];

app.use(
  cors({
    origin: (origin, callback) => {
      // allow no-origin (Postman, native RN, curl)
      if (!origin) return callback(null, true);

      // allow anything in dev if you want to stop fighting CORS
      if (process.env.NODE_ENV !== 'production') return callback(null, true);

      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error(`CORS blocked: ${origin}`));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// --- Body parsers ---
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- Logging ---
// if (process.env.NODE_ENV !== 'production') {
//   app.use(morgan('dev'));
// }

// --- Health check ---
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    owner: 'FLASH DEVS',
    time: new Date().toISOString(),
  });
});

app.get('/', (req, res) => {
  res.json({ message: 'MoniVo API is running...' });
});

// --- Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/transaction', transactionRoutes);
app.use('/api/wallet', walletRoutes);
app.use('/api/categories', categoryRoutes);
// app.use('/api/analytics', analyticsRoutes);

// --- Error handling (MUST be last) ---
app.use(notFound);
app.use(errorHandler);

export default app;