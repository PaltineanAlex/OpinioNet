import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CommunitySidebar from './CommunitySidebar';
import logo from '../logo.png';

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

    return (
        <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-500 flex flex-col">
            <header className="w-full bg-gradient-to-r from-blue-600 to-purple-600 fixed top-0 left-0 flex justify-between items-center px-6 py-4 shadow-md z-50">
                <div className="flex items-center">
                    <img src={logo} alt="OpinioNet Logo" className="w-12 h-12" />
                    <h1 className="text-2xl text-white font-bold ml-2">OpinioNet</h1>
                </div>
                <div className="flex items-center space-x-4">
                    <button onClick={handleShowClusterAnalysis} className="text-white hover:underline">Cluster Analysis</button>
                    <button onClick={handleShowStatistics} className="text-white hover:underline">Show Statistics</button>
                    <button onClick={handleShowChat} className="text-white hover:underline">Chat</button>
                    <div className="relative group">
                        <button className="text-white font-semibold">{username}</button>
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <button onClick={handleEditProfile} className="block px-4 py-2 text-gray-800 hover:bg-gray-200 w-full text-left">Edit Profile</button>
                            <button onClick={handleDeleteProfile} className="block px-4 py-2 text-gray-800 hover:bg-gray-200 w-full text-left">Delete Profile</button>
                            <button onClick={handleLogout} className="block px-4 py-2 text-gray-800 hover:bg-gray-200 w-full text-left">Log Out</button>
                        </div>
                    </div>
                </div>
            </header>
            <div className="pt-24 flex flex-grow">
                <CommunitySidebar username={username} onJoinCommunity={handleJoinCommunity} />
                <div className="flex-grow p-6 max-w-6xl mx-auto">
                    <h2 className="text-3xl font-bold mb-6 text-gray-800">My Feed</h2>
                    <ul className="space-y-4">
                        {posts.map((post) => (
                            <li key={post.id} className="bg-white p-4 rounded-lg shadow-md">
                                <div className="flex justify-between items-center">
                                    <a href={`/post/${post.id}`} className="text-xl font-semibold text-blue-600 hover:underline">{post.title}</a>
                                    <button className="text-blue-500 hover:underline" onClick={() => togglePostDescription(post.id)}>
                                        {expandedPost === post.id ? 'Hide Description' : 'Show Description'}
                                    </button>
                                </div>
                                {expandedPost === post.id && (
                                    <div className="mt-4">
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

export default Feed;
