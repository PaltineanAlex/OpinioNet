const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const router = express.Router();

const db = new sqlite3.Database('./database.db');

// Create a post
router.post('/create', (req, res) => {
    const { communityName, username, title, description } = req.body;

    if (!communityName || !username || !title || !description) {
        console.log('Missing required fields');
        return res.status(400).json({ error: 'Missing required fields' });
    }

    db.get('SELECT id FROM communities WHERE name = ?', [communityName], (err, community) => {
        if (err) {
            console.log('Error selecting community:', err.message);
            return res.status(500).json({ error: 'Database error' });
        }
        if (!community) {
            console.log('Invalid community');
            return res.status(400).json({ error: 'Invalid community' });
        }

        db.run('INSERT INTO posts (community_id, username, title, description) VALUES (?, ?, ?, ?)', [community.id, username, title, description], function(err) {
            if (err) {
                console.log('Error inserting post:', err.message);
                return res.status(400).json({ error: 'Invalid data' });
            }
            res.status(201).json({ message: 'Post created successfully' });
        });
    });
});

// Get all posts for a community
router.get('/community/:communityName', (req, res) => {
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

// Get all posts for a user's feed
router.get('/feed/:username', (req, res) => {
    const { username } = req.params;
    db.all(
        `SELECT p.id, p.title, p.description, p.username, c.name as communityName
         FROM posts p
         JOIN communities c ON p.community_id = c.id
         JOIN user_communities uc ON c.id = uc.community_id
         WHERE uc.username = ?`,
        [username],
        (err, rows) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(rows);
        }
    );
});

// Get a specific post
router.get('/post/:postId', (req, res) => {
    const { postId } = req.params;
    db.get(
        `SELECT p.id, p.title, p.description, p.username 
         FROM posts p 
         WHERE p.id = ?`,
        [postId],
        (err, row) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(row);
        }
    );
});

module.exports = router;
