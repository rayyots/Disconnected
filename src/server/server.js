import express from 'express';
import cors from 'cors';
import connectDB from '../../backend/config/db.js';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import rideRoutes from './routes/rides.js';
import errorHandler from './middleware/errorHandler.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/rides', rideRoutes);

// Error handling
app.use(errorHandler);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));