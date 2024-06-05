const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const sqlite3 = require('sqlite3').verbose();
const app = express();

const db = new sqlite3.Database('./database.db');

const JWT_SECRET = 'PALTI';

app.use(bodyParser.json());
app.use(cors());

// Create tables
db.run('CREATE TABLE IF NOT EXISTS users (email VARCHAR(100) PRIMARY KEY, username VARCHAR(50) UNIQUE, password VARCHAR(50))');

// Routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');

app.use('/auth', authRoutes);
app.use('/user', userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
