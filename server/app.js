// server.js or app.js
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import authRoute from './routes/auth.js';

const app = express();
app.use(express.json());
app.use(cors());

// ✅ Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/recapcha', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB');
});

// ✅ Mount auth routes
app.use('/api/auth', authRoute);

// ✅ Start server
app.listen(5050, () => console.log('Server running on port 5050'));