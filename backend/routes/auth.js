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

router.put('/update', (req, res) => {
    const { currentUsername, newUsername, newPassword, newEmail } = req.body;
    const hashedPassword = jwt.sign(newPassword, JWT_SECRET);

    db.run('UPDATE users SET username = ?, password = ?, email = ? WHERE username = ?', [newUsername, hashedPassword, newEmail, currentUsername], function(err) {
        if (err) {
            return res.status(400).json({ message: 'Error updating user' });
        }
        res.status(200).json({ message: 'User updated successfully' });
    });
});

router.delete('/delete', (req, res) => {
    const { username } = req.body;

    db.serialize(() => {
        db.run('BEGIN TRANSACTION');
        db.run('DELETE FROM reports WHERE reporter = ?', [username]);
        db.run('DELETE FROM comments WHERE username = ?', [username]);
        db.run('DELETE FROM posts WHERE username = ?', [username]);
        db.run('DELETE FROM user_communities WHERE username = ?', [username]);
        db.run('DELETE FROM communities WHERE username = ?', [username]);
        db.run('DELETE FROM users WHERE username = ?', [username], function(err) {
            if (err) {
                db.run('ROLLBACK');
                return res.status(500).json({ message: 'Error deleting user' });
            }
            db.run('COMMIT');
            res.status(200).json({ message: 'User deleted successfully' });
        });
    });
});

module.exports = router;
