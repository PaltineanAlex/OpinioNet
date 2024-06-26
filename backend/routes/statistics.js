const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./database.db');

router.get('/', (req, res) => {
    const queries = {
        userCount: 'SELECT COUNT(*) as count FROM users',
        communityCount: 'SELECT COUNT(*) as count FROM communities',
        postCount: 'SELECT COUNT(*) as count FROM posts',
        commentCount: 'SELECT COUNT(*) as count FROM comments'
    };

    const results = {};

    const runQueries = () => {
        return new Promise((resolve, reject) => {
            const keys = Object.keys(queries);
            let completed = 0;

            keys.forEach(key => {
                db.get(queries[key], [], (err, row) => {
                    if (err) {
                        return reject(err);
                    }

                    results[key] = row.count;

                    if (++completed === keys.length) {
                        resolve(results);
                    }
                });
            });
        });
    };

    runQueries()
        .then(results => res.json(results))
        .catch(err => res.status(500).json({ error: err.message }));
});

module.exports = router;
