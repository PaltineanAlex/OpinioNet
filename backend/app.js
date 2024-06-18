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
// Add these to your existing database setup
db.run('CREATE TABLE IF NOT EXISTS communities (id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(50) UNIQUE, description VARCHAR(250), username VARCHAR(50))');
db.run('CREATE TABLE IF NOT EXISTS user_communities (username VARCHAR(50), community_id INTEGER, PRIMARY KEY (username, community_id))');
db.run('CREATE TABLE IF NOT EXISTS posts (id INTEGER PRIMARY KEY AUTOINCREMENT, community_id INTEGER, username VARCHAR(50), title VARCHAR(100), description TEXT)');
db.run('CREATE TABLE IF NOT EXISTS comments (id INTEGER PRIMARY KEY AUTOINCREMENT, post_id INTEGER, username VARCHAR(50), comment TEXT)');

// Routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const communityRoutes = require('./routes/community');
const postRoutes = require('./routes/post');
const commentRoutes = require('./routes/comment'); 

app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/community', communityRoutes);
app.use('/post', postRoutes); 
app.use('/comment', commentRoutes); 

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
