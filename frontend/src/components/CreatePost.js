import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import logo from '../logo.png';
import '../styles/create-post.scss';

const CreatePost = () => {
    const { communityName } = useParams();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState(null);
    const username = localStorage.getItem('username');
    const navigate = useNavigate();

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
            setImage(reader.result);
        };
        if (file) {
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async () => {
        const imageUrl = image;
        console.log('Submitting Post:', { communityName, username, title, description, image_url: imageUrl });
        const response = await fetch('http://localhost:5000/post/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ communityName, username, title, description, image_url: imageUrl })
        });
        const data = await response.json();
        if (response.ok) {
            navigate(`/community/${communityName}`);
        } else {
            alert(data.message);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('username');
        localStorage.removeItem('token');
        navigate('/');
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

    return (
        <div className="create-post-container">
            <header className="feed-header">
                <div className="logo-container">
                    <img src={logo} alt="OpinioNet Logo" className="logo" />
                    <h1>OpinioNet</h1>
                </div>
                <div className="user-menu">
                    <div className="dropdown">
                        <span className="dropdown-username">{username}</span>
                        <div className="dropdown-content">
                            <button onClick={handleEditProfile}>Edit Profile</button>
                            <button onClick={handleDeleteProfile}>Delete Profile</button>
                            <button onClick={handleLogout}>Log Out</button>
                        </div>
                    </div>
                </div>
            </header>
            <div className="create-post">
                <h2>Create Post in {communityName}</h2>
                <input
                    type="text"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <textarea
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <input type="file" accept="image/*" onChange={handleImageUpload} />
                <button onClick={handleSubmit}>Create Post</button>
                <button onClick={() => navigate(`/community/${communityName}`)}>Back to Community</button>
            </div>
        </div>
    );
};

export default CreatePost;
