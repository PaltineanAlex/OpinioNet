import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Feed from './components/Feed';
import Post from './components/Post';
import CreateCommunity from './components/CreateCommunity';
import Community from './components/Community';
import CreatePost from './components/CreatePost';
import Statistics from './components/Statistics';
import './styles/index.scss';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/feed" element={<Feed />} />
                <Route path="/post/:postId" element={<Post />} />
                <Route path="/create-community" element={<CreateCommunity />} />
                <Route path="/community/:communityName" element={<Community />} />
                <Route path="/community/:communityName/create-post" element={<CreatePost />} />
                <Route path="/statistics" element={<Statistics />} />
            </Routes>
        </Router>
    );
}

export default App;
