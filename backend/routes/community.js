const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const router = express.Router();

const db = new sqlite3.Database('./database.db');

router.post('/search', (req, res) => {
    const { name } = req.body;
    db.get('SELECT * FROM communities WHERE name = ?', [name], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (row) return res.json(row);
        res.status(404).json({ message: 'Community not found' });
    });
});

router.post('/join', (req, res) => {
    const { username, communityName } = req.body;
    if (!username || !communityName) {
        return res.status(400).json({ message: 'Username and Community Name are required' });
    }

    db.get('SELECT id FROM communities WHERE name = ?', [communityName], (err, community) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!community) return res.status(404).json({ message: 'Community not found' });

        db.run('INSERT INTO user_communities (username, community_id) VALUES (?, ?)', [username, community.id], function(err) {
            if (err) return res.status(400).json({ error: 'Already joined or invalid data' });
            res.status(201).json({ message: 'Joined community successfully' });
        });
    });
});

router.post('/leave', (req, res) => {
    const { username, communityName } = req.body;
    if (!username || !communityName) {
        return res.status(400).json({ message: 'Username and Community Name are required' });
    }

    db.get('SELECT id FROM communities WHERE name = ?', [communityName], (err, community) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!community) return res.status(404).json({ message: 'Community not found' });

        db.run('DELETE FROM user_communities WHERE username = ? AND community_id = ?', [username, community.id], function(err) {
            if (err) return res.status(500).json({ error: err.message });
            res.status(200).json({ message: 'Left community successfully' });
        });
    });
});

router.post('/create', (req, res) => {
    const { name, description, username } = req.body;
    if (!name || !description || !username) {
        return res.status(400).json({ message: 'Name, description, and username are required' });
    }

    db.run('INSERT INTO communities (name, description, username) VALUES (?, ?, ?)', [name, description, username], function(err) {
        if (err) return res.status(400).json({ error: 'Community already exists or invalid data' });
        res.status(201).json({ message: 'Community created successfully' });
    });
});

router.get('/joined/:username', (req, res) => {
    const { username } = req.params;
    db.all('SELECT c.id, c.name FROM communities c JOIN user_communities uc ON c.id = uc.community_id WHERE uc.username = ?', [username], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

router.get('/:communityName', (req, res) => {
    const { communityName } = req.params;
    const { username } = req.query;
    db.get('SELECT * FROM communities WHERE name = ?', [communityName], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!row) return res.status(404).json({ message: 'Community not found' });
        db.get('SELECT * FROM user_communities WHERE username = ? AND community_id = ?', [username, row.id], (err, userCommunity) => {
            if (err) return res.status(500).json({ error: err.message });
            row.joined = !!userCommunity;
            row.creator = row.creator; // Ensure creator is part of the response
            res.json(row);
        });
    });
});


router.get('/posts/:communityName', (req, res) => {
    const { communityName } = req.params;
    db.all(
        `SELECT p.id, p.title, p.description, p.username 
         FROM posts p 
         JOIN communities c ON p.community_id = c.id 
         WHERE c.name = ?`,
        [communityName],
        (err, rows) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(rows);
        }
    );
});


router.put('/update', (req, res) => {
    const { communityId, username, name, description } = req.body;
    db.get('SELECT * FROM communities WHERE id = ? AND username = ?', [communityId, username], (err, community) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!community) return res.status(403).json({ message: 'You do not have permission to edit this community' });

        db.run('UPDATE communities SET name = ?, description = ? WHERE id = ?', [name, description, communityId], function(err) {
            if (err) return res.status(400).json({ error: 'Invalid data' });
            res.status(200).json({ message: 'Community updated successfully' });
        });
    });
});

// community.js

// community.js

router.delete('/delete', (req, res) => {
    const { communityId, username } = req.body;
    db.get('SELECT * FROM communities WHERE id = ? AND username = ?', [communityId, username], (err, community) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!community) return res.status(403).json({ message: 'You do not have permission to delete this community' });

        // Delete comments, posts, user_communities entries, and community in a transaction
        db.serialize(() => {
            db.run('BEGIN TRANSACTION');
            db.run('DELETE FROM comments WHERE post_id IN (SELECT id FROM posts WHERE community_id = ?)', [communityId]);
            db.run('DELETE FROM posts WHERE community_id = ?', [communityId]);
            db.run('DELETE FROM user_communities WHERE community_id = ?', [communityId]);
            db.run('DELETE FROM communities WHERE id = ?', [communityId], function(err) {
                if (err) {
                    db.run('ROLLBACK');
                    return res.status(500).json({ error: err.message });
                }
                db.run('COMMIT');
                res.status(200).json({ message: 'Community deleted successfully' });
            });
        });
    });
});

module.exports = router;
