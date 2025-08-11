const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('../routes/auth');
const profileRoutes = require('../routes/profiles');

const app = express();

app.use(cors());
app.use(express.json());

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch((err) => console.error('MongoDB connection error:', err));

app.use('/api/auth', authRoutes);
app.use('/api/profiles', profileRoutes);

// Test route for Vercel deployment
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working!' });
});

module.exports = app;
