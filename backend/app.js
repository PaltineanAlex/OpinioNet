const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const sqlite3 = require('sqlite3').verbose();
const http = require('http');
const { Server } = require('socket.io');
const kmeans = require('node-kmeans');
const app = express();

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
        allowedHeaders: ["Content-Type", "Authorization"],
    }
});

const db = new sqlite3.Database('./database.db');

const JWT_SECRET = 'PALTI';

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['*']
}));

db.run('CREATE TABLE IF NOT EXISTS users (email VARCHAR(100) PRIMARY KEY, username VARCHAR(50) UNIQUE, password VARCHAR(50))');
db.run('CREATE TABLE IF NOT EXISTS communities (id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(50) UNIQUE, description VARCHAR(250), username VARCHAR(50))');
db.run('CREATE TABLE IF NOT EXISTS user_communities (username VARCHAR(50), community_id INTEGER, PRIMARY KEY (username, community_id))');
db.run('CREATE TABLE IF NOT EXISTS posts (id INTEGER PRIMARY KEY AUTOINCREMENT, community_id INTEGER, username VARCHAR(50), title VARCHAR(100), description TEXT)');
db.run('CREATE TABLE IF NOT EXISTS comments (id INTEGER PRIMARY KEY AUTOINCREMENT, post_id INTEGER, username VARCHAR(50), comment TEXT)');
db.run('CREATE TABLE IF NOT EXISTS reports (id INTEGER PRIMARY KEY AUTOINCREMENT, type VARCHAR(50), content_id INTEGER, reporter VARCHAR(50), reason TEXT, status VARCHAR(50) DEFAULT "pending")');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const communityRoutes = require('./routes/community');
const postRoutes = require('./routes/post');
const commentRoutes = require('./routes/comment'); 
const statisticsRoutes = require('./routes/statistics');
const reportRoutes = require('./routes/report');

app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/community', communityRoutes);
app.use('/post', postRoutes); 
app.use('/comment', commentRoutes); 
app.use('/statistics', statisticsRoutes);
app.use('/report', reportRoutes);

io.on('connection', (socket) => {
    const username = socket.handshake.query.username;
    
    socket.on('join', () => {
        io.emit('notification', { text: `${username} has joined the chat` });
    });

    socket.on('leave', () => {
        io.emit('notification', { text: `${username} has left the chat` });
    });

    socket.on('disconnect', () => {
        io.emit('notification', { text: `${username} has disconnected` });
    });

    socket.on('chat message', (msg) => {
        io.emit('chat message', msg);
    });
});

function generateDummyData(numUsers) {
    const users = [];
    for (let i = 0; i < numUsers; i++) {
        const post_count = Math.floor(Math.random() * 30) + 1;
        const comment_count = Math.floor(Math.random() * 30) + 1;
        users.push({
            username: `user${i + 1}`,
            post_count,
            comment_count
        });
    }
    return users;
}

app.get('/cluster-analysis', (req, res) => {
    db.all(`SELECT users.username, COUNT(posts.id) AS post_count, COUNT(comments.id) AS comment_count 
            FROM users 
            LEFT JOIN posts ON users.username = posts.username 
            LEFT JOIN comments ON users.username = comments.username 
            GROUP BY users.username`, (err, rows) => {
        if (err) {
            console.error('Database query error:', err.message);
            return res.status(500).json({ error: err.message });
        }

        console.log('Rows:', rows);

        const dummyData = generateDummyData(30);
        const combinedData = rows.concat(dummyData); 

        const data = combinedData.map(row => [row.post_count, row.comment_count]);
        console.log('Data for clustering:', data);

        const k = Math.min(3, data.length);

        if (k < 2) {
            return res.status(400).json({ error: 'Not enough data points for clustering' });
        }

        kmeans.clusterize(data, { k: k }, (err, result) => {
            if (err) {
                console.error('Clustering error:', err.message);
                return res.status(500).json({ error: err.message });
            }

            const clusteredUsers = result.map((cluster, index) => ({
                cluster: index,
                users: cluster.clusterInd.map(i => ({
                    username: combinedData[i].username,
                    post_count: combinedData[i].post_count,
                    comment_count: combinedData[i].comment_count
                }))
            }));

            console.log('Clustered Users:', clusteredUsers);

            res.json({ clusters: clusteredUsers });
        });
    });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
