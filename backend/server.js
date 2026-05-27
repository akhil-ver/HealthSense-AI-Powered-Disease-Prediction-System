import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { sequelize } from './models/associations.js';

dotenv.config();

const app = express();

import authRoutes from './routes/authRoutes.js';
import predictionRoutes from './routes/predictionRoutes.js';

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', predictionRoutes);

// Basic health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'HealthSense AI Backend is running' });
});

// Sync Database and Start Server
const PORT = process.env.PORT || 3001;

sequelize.sync({ alter: true })
  .then(() => {
    console.log('Database synced successfully');
    app.listen(PORT, () => {
      console.log(`Backend server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to sync database:', err);
  });
