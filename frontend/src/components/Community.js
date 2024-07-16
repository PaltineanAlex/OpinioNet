import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import logo from '../logo.png';

const Community = () => {
    const { communityName } = useParams();
    const [community, setCommunity] = useState(null);
    const [posts, setPosts] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [newName, setNewName] = useState('');
    const [newDescription, setNewDescription] = useState('');
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

    const handleDelete = async () => {
        const confirmed = window.confirm('Are you sure you want to delete this community? This action cannot be undone.');
        if (confirmed) {
            try {
                const response = await fetch('http://localhost:5000/community/delete', {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ communityId: community.id, username })
                });
                const data = await response.json();
                if (response.ok) {
                    navigate('/feed');
                } else {
                    alert(data.message);
                }
            } catch (error) {
                console.error('Error deleting community:', error);
            }
        }
    };

    const handleEditProfile = () => {
        navigate('/edit-profile');
    };

    const handleDeleteProfile = async () => {
        const confirmed = window.confirm('Are you sure you want to delete your account? This action cannot be undone.');
        if (confirmed) {
            try {
                const response = await fetch('http://localhost:5000/auth/delete', {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ username })
                });
                if (response.ok) {
                    handleLogout();
                } else {
                    const data = await response.json();
                    alert(data.message);
                }
            } catch (error) {
                console.error('Error deleting profile:', error);
            }
        }
    };

    const togglePostDescription = (postId) => {
        setExpandedPost(expandedPost === postId ? null : postId);
    };

    const handleReportManagement = () => {
        navigate(`/report-management/${community.id}`);
    };

    if (!community) {
        return <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-500 text-white">Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-500 flex flex-col items-center">
            <header className="w-full bg-gradient-to-r from-blue-600 to-purple-600 fixed top-0 left-0 flex justify-between items-center px-6 py-4 shadow-md z-50">
                <div className="flex items-center">
                    <img src={logo} alt="OpinioNet Logo" className="w-12 h-12" />
                    <Link to="/feed" className="text-2xl text-white font-bold ml-2">OpinioNet</Link>
                </div>
                <div className="relative group">
                    <button className="text-white font-semibold">{username}</button>
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <button onClick={handleEditProfile} className="block px-4 py-2 text-gray-800 hover:bg-gray-200 w-full text-left">Edit Profile</button>
                        <button onClick={handleDeleteProfile} className="block px-4 py-2 text-gray-800 hover:bg-gray-200 w-full text-left">Delete Profile</button>
                        <button onClick={handleLogout} className="block px-4 py-2 text-gray-800 hover:bg-gray-200 w-full text-left">Log Out</button>
                    </div>
                </div>
            </header>
            <div className="pt-24 w-full max-w-4xl">
                {isEditing ? (
                    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                        <input
                            type="text"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            className="w-full px-4 py-2 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <textarea
                            value={newDescription}
                            onChange={(e) => setNewDescription(e.target.value)}
                            className="w-full px-4 py-2 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button onClick={handleSave} className="w-full py-2 px-4 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition duration-200 mb-2">
                            Save
                        </button>
                        <button onClick={() => setIsEditing(false)} className="w-full py-2 px-4 bg-gray-500 text-white font-semibold rounded-lg hover:bg-gray-600 transition duration-200">
                            Cancel
                        </button>
                    </div>
                ) : (
                    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                        <h2 className="text-3xl font-bold mb-4">{community.name}</h2>
                        <p className="text-gray-700 mb-4">{community.description}</p>
                        {community.username === username && (
                            <div className="flex space-x-4">
                                <button onClick={handleEdit} className="py-2 px-4 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition duration-200">Edit</button>
                                <button onClick={handleDelete} className="py-2 px-4 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition duration-200">Delete</button>
                                <button onClick={handleReportManagement} className="py-2 px-4 bg-yellow-500 text-white font-semibold rounded-lg hover:bg-yellow-600 transition duration-200">Manage Reports</button>
                            </div>
                        )}
                    </div>
                )}
                <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                    <div className="flex space-x-4 mb-4">
                        <button onClick={handleJoinLeave} className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition duration-200">
                            {community.joined ? 'Leave Community' : 'Join Community'}
                        </button>
                        {community.joined && (
                            <button onClick={handleCreatePost} className="w-full py-2 px-4 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition duration-200">
                                Create Post
                            </button>
                        )}
                    </div>
                    <h3 className="text-2xl font-bold mb-4">Community Feed</h3>
                    <ul className="space-y-4">
                        {posts.map((post) => (
                            <li key={post.id} className="bg-gray-100 p-4 rounded-lg shadow-md">
                                <div className="flex justify-between items-center mb-2">
                                    <a href={`/post/${post.id}`} className="text-xl font-semibold text-blue-600 hover:underline">{post.title}</a>
                                    <button className="text-blue-500 hover:underline" onClick={() => togglePostDescription(post.id)}>
                                        {expandedPost === post.id ? 'Hide Description' : 'Show Description'}
                                    </button>
                                </div>
                                {expandedPost === post.id && (
                                    <div>
                                        <p className="text-gray-700">{post.description}</p>
                                        {post.image_url && <img src={post.image_url} alt="Post" className="mt-4 rounded-lg mx-auto" />}
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

export default Community;
