import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cors from 'cors';
import connectDB from './config/db.js';
import AuthRoutes from './routes/AuthRoutes.js';
import DataRoutes from './routes/DataRoutes.js';
import uploadRoute from './routes/uploadRoute.js';
import userRoutes from './routes/userRoutes.js';
import { errorHandler, notFound, sanitizeServerErrors } from './middleware/errorHandler.js';

const PORT = process.env.PORT || 5000;
const app = express();

// Vercel / proxies: needed so rate limiting sees the real client IP
app.set('trust proxy', 1);
app.disable('x-powered-by');

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '1mb' }));
// Express 5 leaves req.body undefined when no body was sent; handlers destructure it
app.use((req, res, next) => {
  req.body ??= {};
  next();
});
app.use(sanitizeServerErrors);

const tooMany = { message: 'Too many attempts, please wait a few minutes and try again' };
const limiter = (max, windowMs = 15 * 60 * 1000) =>
  rateLimit({ windowMs, max, standardHeaders: true, legacyHeaders: false, message: tooMany });

// Brute-force protection on credential / OTP endpoints, generous cap everywhere else
app.use('/api/auth/login', limiter(30));
app.use('/api/auth/forgot-password', limiter(10));
app.use('/api/auth/verify-otp', limiter(20));
app.use('/api/auth/reset-password', limiter(20));
app.use('/api', limiter(1000, 60 * 1000));

// Connect to MongoDB
connectDB();

// Routes

// Auth routes
app.use('/api/auth', AuthRoutes);
app.use('/api/auth', DataRoutes);
app.use('/api/auth', uploadRoute);
app.use('/api/auth', userRoutes);
app.get('/', (req, res) => {
  res.send('Hello, Modular Backend!');
});

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

export default app;
