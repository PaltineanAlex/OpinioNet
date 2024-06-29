const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const router = express.Router();

const db = new sqlite3.Database('./database.db');

router.post('/create', (req, res) => {
    const { communityName, username, title, description, image_url } = req.body;

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

        db.run('INSERT INTO posts (community_id, username, title, description, image_url) VALUES (?, ?, ?, ?, ?)', [community.id, username, title, description, image_url], function(err) {
            if (err) {
                console.log('Error inserting post:', err.message);
                return res.status(400).json({ error: 'Invalid data' });
            }
            res.status(201).json({ message: 'Post created successfully' });
        });
    });
});

router.get('/community/posts/:communityName', (req, res) => {
    const { communityName } = req.params;
    db.all(
        `SELECT p.id, p.title, p.description, p.image_url, p.username 
         FROM posts p 
         JOIN communities c ON p.community_id = c.id 
         WHERE c.name = ?`,
        [communityName],
        (err, rows) => {
            if (err) {
                console.error('Error fetching posts:', err.message);
                return res.status(500).json({ error: err.message });
            }
            res.json(rows);
        }
    );
});

router.get('/feed/:username', (req, res) => {
    const { username } = req.params;
    db.all(
        `SELECT p.id, p.title, p.description, p.image_url, p.username, c.name as communityName
         FROM posts p
         JOIN communities c ON p.community_id = c.id
         JOIN user_communities uc ON c.id = uc.community_id
         WHERE uc.username = ?`,
        [username],
        (err, rows) => {
            if (err) {
                console.error('Error fetching feed posts:', err.message);
                return res.status(500).json({ error: err.message });
            }
            res.json(rows);
        }
    );
});

router.get('/post/:postId', (req, res) => {
    const { postId } = req.params;
    db.get(
        `SELECT p.id, p.title, p.description, p.image_url, p.username 
         FROM posts p 
         WHERE p.id = ?`,
        [postId],
        (err, row) => {
            if (err) {
                console.error('Error fetching post:', err.message);
                return res.status(500).json({ error: err.message });
            }
            res.json(row);
        }
    );
});

router.put('/update', (req, res) => {
    const { postId, username, title, description, image_url } = req.body;
    db.get('SELECT * FROM posts WHERE id = ? AND username = ?', [postId, username], (err, post) => {
        if (err) {
            console.error('Error selecting post:', err.message);
            return res.status(500).json({ error: err.message });
        }
        if (!post) return res.status(403).json({ message: 'You do not have permission to edit this post' });

        db.run('UPDATE posts SET title = ?, description = ?, image_url = ? WHERE id = ?', [title, description, image_url, postId], function(err) {
            if (err) {
                console.error('Error updating post:', err.message);
                return res.status(400).json({ error: 'Invalid data' });
            }
            res.status(200).json({ message: 'Post updated successfully' });
        });
    });
});

router.delete('/delete', (req, res) => {
    const { postId, username } = req.body;
    db.get('SELECT * FROM posts WHERE id = ? AND username = ?', [postId, username], (err, post) => {
        if (err) {
            console.error('Error selecting post:', err.message);
            return res.status(500).json({ error: err.message });
        }
        if (!post) return res.status(403).json({ message: 'You do not have permission to delete this post' });

        db.serialize(() => {
            db.run('BEGIN TRANSACTION');
            db.run('DELETE FROM comments WHERE post_id = ?', [postId]);
            db.run('DELETE FROM posts WHERE id = ?', [postId], function(err) {
                if (err) {
                    db.run('ROLLBACK');
                    console.error('Error deleting post:', err.message);
                    return res.status(500).json({ error: err.message });
                }
                db.run('COMMIT');
                res.status(200).json({ message: 'Post deleted successfully', communityId: post.community_id });
            });
        });
    });
});

module.exports = router;
