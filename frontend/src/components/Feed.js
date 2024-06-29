import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CommunitySidebar from './CommunitySidebar';
import logo from '../logo.png';
import '../styles/feed.scss';

const Feed = () => {
    const [posts, setPosts] = useState([]);
    const [expandedPost, setExpandedPost] = useState(null);
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

    const handleShowClusterAnalysis = () => {
        navigate('/cluster-analysis');
    };

    const handleShowStatistics = () => {
        navigate('/statistics');
    };

    const handleShowChat = () => {
        navigate('/chat');
    };

    const togglePostDescription = (postId) => {
        setExpandedPost(expandedPost === postId ? null : postId);
    };

    return (
        <div>
            <header className="feed-header">
                <div className="logo-container">
                    <img src={logo} alt="OpinioNet Logo" className="logo" />
                    <h1>OpinioNet</h1>
                </div>
                <div className="header-buttons">
                    <button onClick={handleShowClusterAnalysis}>Cluster Analysis</button>
                    <button onClick={handleShowStatistics}>Show Statistics</button>
                    <button onClick={handleShowChat}>Chat</button>
                    <div className="user-menu">
                        <div className="dropdown">
                            <span className="dropdown-username">{username}</span>
                            <div className="dropdown-content">
                                <button onClick={handleLogout}>Log Out</button>
                            </div>
                        </div>
                    </div>
                </div>
            </header>
            <div className="feed-container">
                <CommunitySidebar username={username} onJoinCommunity={handleJoinCommunity} />
                <div className="feed">
                    <h2>My Feed</h2>
                    <ul className="post-list">
                        {posts.map((post) => (
                            <li key={post.id} className="post-item">
                                <div className="post-header">
                                    <a href={`/post/${post.id}`} className="post-title">{post.title}</a>
                                    <button className="toggle-description" onClick={() => togglePostDescription(post.id)}>
                                        {expandedPost === post.id ? 'Hide Description' : 'Show Description'}
                                    </button>
                                </div>
                                {expandedPost === post.id && (
                                    <div className="post-description">
                                        <p>{post.description}</p>
                                        {post.image_url && <img src={post.image_url} alt="Post" />}
                                    </div>
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
