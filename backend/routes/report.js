const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./database.db');

router.post('/create', (req, res) => {
    const { type, contentId, reporter, reason } = req.body;
    db.run('INSERT INTO reports (type, content_id, reporter, reason) VALUES (?, ?, ?, ?)', [type, contentId, reporter, reason], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ id: this.lastID, type, contentId, reporter, reason, status: 'pending' });
    });
});

router.get('/community/:communityId', (req, res) => {
    const { communityId } = req.params;
    db.all(`SELECT reports.*, posts.title AS post_title, comments.comment AS comment_text FROM reports
            LEFT JOIN posts ON reports.type = 'post' AND reports.content_id = posts.id
            LEFT JOIN comments ON reports.type = 'comment' AND reports.content_id = comments.id
            WHERE posts.community_id = ? OR comments.post_id IN (SELECT id FROM posts WHERE community_id = ?)`, 
            [communityId, communityId], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

router.put('/resolve/:reportId', (req, res) => {
    const { reportId } = req.params;
    const { action } = req.body;
    db.get('SELECT * FROM reports WHERE id = ?', [reportId], (err, report) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (!report) {
            return res.status(404).json({ error: 'Report not found' });
        }
        if (action === 'delete') {
            if (report.type === 'post') {
                db.serialize(() => {
                    db.run('BEGIN TRANSACTION');
                    db.run('DELETE FROM comments WHERE post_id = ?', [report.content_id], function(err) {
                        if (err) {
                            db.run('ROLLBACK');
                            return res.status(500).json({ error: err.message });
                        }
                    });
                    db.run('DELETE FROM posts WHERE id = ?', [report.content_id], function(err) {
                        if (err) {
                            db.run('ROLLBACK');
                            return res.status(500).json({ error: err.message });
                        }
                    });
                    db.run('COMMIT', function(err) {
                        if (err) {
                            return res.status(500).json({ error: err.message });
                        }
                    });
                });
            } else if (report.type === 'comment') {
                db.run('DELETE FROM comments WHERE id = ?', [report.content_id], function(err) {
                    if (err) {
                        return res.status(500).json({ error: err.message });
                    }
                });
            }
        }
        db.run('DELETE FROM reports WHERE id = ?', [reportId], function(err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json({ message: 'Report resolved' });
        });
    });
});

module.exports = router;
