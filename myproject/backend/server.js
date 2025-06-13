const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();

app.use(cors());
app.use(express.json());

app.get('/', function (req, res) {
  res.send('Hello! Backend is working.');
});
app.listen(5000);

const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.log('Error:', err));

const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);


const complaintRoutes = require('./complaint');
complaintRoutes(app);

const managerRoutes = require('./manager');
app.use('/api/manager', managerRoutes);



