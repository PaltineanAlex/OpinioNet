import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import logo from '../logo.png';
import '../App.css';

const Community = () => {
    const { communityName } = useParams();
    const [community, setCommunity] = useState(null);
    const [posts, setPosts] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [newName, setNewName] = useState('');
    const [newDescription, setNewDescription] = useState('');
    const [expandedPostId, setExpandedPostId] = useState(null);
    const [expandedPost, setExpandedPost] = useState(null);
    const username = localStorage.getItem('username');
    const navigate = useNavigate();

    const fetchCommunity = async () => {
        try {
            const response = await fetch(`http://localhost:5000/community/${communityName}?username=${username}`);
            const data = await response.json();
            if (response.ok) {
                setCommunity(data);
            } else {
                setCommunity(null);
            }
        } catch (error) {
            console.error('Error fetching community:', error);
            setCommunity(null);
        }
    };

    const fetchPosts = async () => {
        try {
            const response = await fetch(`http://localhost:5000/community/posts/${communityName}`);
            const data = await response.json();
            if (Array.isArray(data)) {
                setPosts(data);
            } else {
                setPosts([]);
            }
        } catch (error) {
            console.error('Error fetching posts:', error);
            setPosts([]);
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

    const handleEdit = () => {
        setIsEditing(true);
        setNewName(community.name);
        setNewDescription(community.description);
    };

    const handleSave = async () => {
        try {
            const response = await fetch('http://localhost:5000/community/update', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ communityId: community.id, username, name: newName, description: newDescription })
            });
            const data = await response.json();
            if (response.ok) {
                setCommunity({ ...community, name: newName, description: newDescription });
                setIsEditing(false);
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error('Error updating community:', error);
        }
    };

    const handleDelete = async (postId) => {
        try {
            const response = await fetch('http://localhost:5000/post/delete', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ postId, username })
            });
            const data = await response.json();
            if (response.ok) {
                fetchPosts();
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error('Error deleting post:', error);
        }
    };

    const toggleDropdown = (postId) => {
        setExpandedPostId(expandedPostId === postId ? null : postId);
    };

    const togglePostDescription = (postId) => {
        setExpandedPost(expandedPost === postId ? null : postId);
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
                {isEditing ? (
                    <div>
                        <input
                            type="text"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                        />
                        <textarea
                            value={newDescription}
                            onChange={(e) => setNewDescription(e.target.value)}
                        />
                        <button onClick={handleSave}>Save</button>
                        <button onClick={() => setIsEditing(false)}>Cancel</button>
                    </div>
                ) : (
                    <div>
                        <h2>{community.name}</h2>
                        <p>{community.description}</p>
                        {community.username === username && (
                            <div>
                                <button onClick={handleEdit}>Edit</button>
                                <button onClick={handleDelete}>Delete</button>
                            </div>
                        )}
                    </div>
                )}
                <div className="button-container">
                    <button onClick={handleJoinLeave}>
                        {community.joined ? 'Leave Community' : 'Join Community'}
                    </button>
                    {community.joined && (
                        <button onClick={handleCreatePost}>Create Post</button>
                    )}
                </div>
                <h3>Community Feed</h3>
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
    );
};

export default Community;
