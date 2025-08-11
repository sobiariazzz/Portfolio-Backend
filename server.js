require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profiles');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error', err));

app.use('/api/auth', authRoutes);
app.use('/api/profiles', profileRoutes);

app.get('/', (req, res) => res.send('Portfolio Builder API'));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
