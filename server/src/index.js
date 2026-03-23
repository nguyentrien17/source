const { Sequelize } = require('sequelize');
require('dotenv').config({ path: '../.env' });
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// SQL connection
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
  host: process.env.DB_HOST || 'localhost',
  dialect: 'mysql',
});

sequelize.authenticate()
  .then(() => console.log('Connected to MySQL database'))
  .catch(err => console.error('Unable to connect to DB:', err));

// Import routes
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

const routes = require('./routes/index');
app.use('/api', routes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
