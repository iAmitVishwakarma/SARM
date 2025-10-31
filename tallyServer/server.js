import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import cookieParser from 'cookie-parser'; 
import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import itemRoutes from './routes/itemRoutes.js';
import partyRoutes from './routes/partyRoutes.js';
import transactionRoutes from './routes/transactionRoutes.js';
import reportRoutes from './routes/reportRoutes.js';

// Connect to MongoDB
connectDB();

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());
app.use(cookieParser()); // <-- USE COOKIE PARSER

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));

app.get('/', (req, res) => {
  res.send('SARM Backend API is running...');
});

// --- API Routes ---
app.use('/api/auth', userRoutes); // <-- AUTH ROUTES
app.use('/api/items', itemRoutes); // <-- ITEM ROUTES
app.use('/api/parties', partyRoutes); // <--  PARTY ROUTES
app.use('/api/transactions', transactionRoutes); // <-- TRANSACTION ROUTES
app.use('/api/reports', reportRoutes); // <-- REPORT ROUTES


// TODO: Error handling middleware

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});