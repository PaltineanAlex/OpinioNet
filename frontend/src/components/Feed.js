import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CommunitySidebar from './CommunitySidebar';
import logo from '../logo.png';

const Feed = () => {
    const [posts, setPosts] = useState([]);
    const [expandedPostId, setExpandedPostId] = useState(null);
    const username = localStorage.getItem('username');
    const navigate = useNavigate();

    const fetchPosts = async () => {
        if (!username) {
            console.error('Username is null or undefined');
            return;
        }

        try {
            const response = await fetch(`http://localhost:5000/post/feed/${username}`);
            const data = await response.json();
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

    const toggleDropdown = (postId) => {
        setExpandedPostId(expandedPostId === postId ? null : postId);
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
                                <button onClick={() => toggleDropdown(post.id)}>
                                    {expandedPostId === post.id ? 'Hide' : 'Show'} Description
                                </button>
                                {expandedPostId === post.id && (
                                    <p>{post.description}</p>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Feed;
