const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const router = express.Router();

const db = new sqlite3.Database('./database.db');

router.post('/create', (req, res) => {
    const { communityId, userId, title, description } = req.body;
    db.run('INSERT INTO posts (community_id, user_id, title, description) VALUES (?, ?, ?, ?)', [communityId, userId, title, description], function(err) {
        if (err) return res.status(400).json({ error: 'Invalid data' });
        res.status(201).json({ message: 'Post created successfully' });
    });
});

router.get('/:communityId', (req, res) => {
    const { communityId } = req.params;
    db.all('SELECT * FROM posts WHERE community_id = ?', [communityId], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

router.get('/post/:postId', (req, res) => {
    const { postId } = req.params;
    db.get('SELECT * FROM posts WHERE id = ?', [postId], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(row);
    });
});

module.exports = router;
