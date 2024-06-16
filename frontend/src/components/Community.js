import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import logo from '../logo.png';
import '../App.css';

const Community = () => {
    const { communityName } = useParams();
    const [community, setCommunity] = useState(null);
    const [posts, setPosts] = useState([]);
    const username = localStorage.getItem('username');
    const navigate = useNavigate();

    const fetchCommunity = async () => {
        try {
            const response = await fetch(`http://localhost:5000/community/${communityName}?username=${username}`);
            const data = await response.json();
            setCommunity(data);
        } catch (error) {
            console.error('Error fetching community:', error);
        }
    };

    const fetchPosts = async () => {
        try {
            const response = await fetch(`http://localhost:5000/post/community/${communityName}`);
            const data = await response.json();
            setPosts(data);
        } catch (error) {
            console.error('Error fetching posts:', error);
        }
    };

    useEffect(() => {
        fetchCommunity();
        fetchPosts();
    }, [communityName]);

    const handleJoinLeave = async () => {
        const endpoint = community.joined ? 'leave' : 'join';
        try {
            const response = await fetch(`http://localhost:5000/community/${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, communityName })
            });
            const data = await response.json();
            if (response.ok) {
                setCommunity({ ...community, joined: !community.joined });
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error('Error joining/leaving community:', error);
        }
    };

    const handleCreatePost = () => {
        navigate(`/community/${communityName}/create-post`);
    };

    const handleLogout = () => {
        localStorage.removeItem('username');
        localStorage.removeItem('token');
        navigate('/');
    };

    if (!community) {
        return <div>Loading...</div>;
    }

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
            <div className="community-container">
                <h2>{community.name}</h2>
                <p>{community.description}</p>
                <div className="button-container">
                    <button onClick={handleJoinLeave}>
                        {community.joined ? 'Leave Community' : 'Join Community'}
                    </button>
                    {community.joined && (
                        <button onClick={handleCreatePost}>Create Post</button>
                    )}
                </div>
                <h3>Community Feed</h3>
                <ul>
                    {posts.map((post) => (
                        <li key={post.id}>
                            <a href={`/post/${post.id}`}>{post.title}</a>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Community;
