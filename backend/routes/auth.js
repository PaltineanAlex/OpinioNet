const express = require('express');
const jwt = require('jsonwebtoken');
const sqlite3 = require('sqlite3').verbose();
const router = express.Router();

const db = new sqlite3.Database('./database.db');
const JWT_SECRET = 'PALTI';

router.post('/register', (req, res) => {
    const { email, username, password } = req.body;
    const hashedPassword = jwt.sign(password, JWT_SECRET);

    db.run('INSERT INTO users (email, username, password) VALUES (?, ?, ?)', [email, username, hashedPassword], function(err) {
        if (err) {
            return res.status(400).json({ message: 'User already exists or invalid data' });
        }
        res.status(201).json({ message: 'User created successfully' });
    });
});

router.post('/login', (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = jwt.sign(password, JWT_SECRET);

    db.get('SELECT * FROM users WHERE username = ? AND password = ?', [username, hashedPassword], (err, row) => {
        if (err || !row) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const token = jwt.sign({ username: row.username }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, username: row.username });
    });
});

module.exports = router;
