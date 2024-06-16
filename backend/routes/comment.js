const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const router = express.Router();

const db = new sqlite3.Database('./database.db');

router.post('/create', (req, res) => {
    const { postId, username, comment } = req.body;
    db.run('INSERT INTO comments (post_id, username, comment) VALUES (?, ?, ?)', [postId, username, comment], function(err) {
        if (err) return res.status(400).json({ error: 'Invalid data' });
        res.status(201).json({ id: this.lastID, postId, username, comment, message: 'Comment added successfully' });
    });
});

router.get('/:postId', (req, res) => {
    const { postId } = req.params;
    db.all('SELECT * FROM comments WHERE post_id = ?', [postId], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

module.exports = router;
