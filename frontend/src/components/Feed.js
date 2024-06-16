import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CommunitySidebar from './CommunitySidebar';
import logo from '../logo.png';

const Feed = () => {
    const [posts, setPosts] = useState([]);
    const username = localStorage.getItem('username');
    console.log('Retrieved Username:', username); // Log the retrieved username
    const navigate = useNavigate();

    const fetchPosts = async () => {
        if (!username) {
            console.error('Username is null or undefined');
            return;
        }

        try {
            const response = await fetch(`http://localhost:5000/post/${username}`);
            const text = await response.text();
            console.log('Response Text:', text); // Log the raw response
            const data = JSON.parse(text);
            setPosts(data);
        } catch (error) {
            console.error('Error fetching posts:', error);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, [username]);

    const handleJoinCommunity = () => {
        fetchPosts();
    };

    const handleLogout = () => {
        localStorage.removeItem('username');
        localStorage.removeItem('token');
        navigate('/');
    };

    return (
        <div>
            <header className="feed-header">
                <div className="logo-container">
                    <img src={logo} alt="OpinioNet Logo" className="logo" />
                    <h1>OpinioNet</h1>
                </div>
                <div className="user-menu">
                    <div className="dropdown">
                        <span className="dropdown-username">{username}</span>
                        <div className="dropdown-content">
                            <button onClick={handleLogout}>Log Out</button>
                        </div>
                    </div>
                </div>
            </header>
            <div className="feed-container">
                <CommunitySidebar username={username} onJoinCommunity={handleJoinCommunity} />
                <div className="feed">
                    <h2>My Feed</h2>
                    <ul>
                        {posts.map((post) => (
                            <li key={post.id}>
                                <a href={`/post/${post.id}`}>{post.title}</a>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Feed;
