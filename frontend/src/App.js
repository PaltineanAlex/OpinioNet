import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Feed from './components/Feed';
import Post from './components/Post';
import CreateCommunity from './components/CreateCommunity';
import Community from './components/Community';
import './App.css';

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
            </Routes>
        </Router>
    );
}

export default App;
