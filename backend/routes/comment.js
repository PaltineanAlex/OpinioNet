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

router.put('/update', (req, res) => {
    const { commentId, username, comment } = req.body;
    db.get('SELECT * FROM comments WHERE id = ? AND username = ?', [commentId, username], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!row) return res.status(403).json({ message: 'You do not have permission to edit this comment' });

        db.run('UPDATE comments SET comment = ? WHERE id = ?', [comment, commentId], function(err) {
            if (err) return res.status(400).json({ error: 'Invalid data' });
            res.status(200).json({ message: 'Comment updated successfully' });
        });
    });
});

router.delete('/delete', (req, res) => {
    const { commentId, username } = req.body;
    db.get('SELECT * FROM comments WHERE id = ? AND username = ?', [commentId, username], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!row) return res.status(403).json({ message: 'You do not have permission to delete this comment' });

        db.run('DELETE FROM comments WHERE id = ?', [commentId], function(err) {
            if (err) return res.status(500).json({ error: err.message });
            res.status(200).json({ message: 'Comment deleted successfully' });
        });
    });
});

module.exports = router;
