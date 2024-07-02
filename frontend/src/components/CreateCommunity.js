import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../logo.png';

const CreateCommunity = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const username = localStorage.getItem('username');
    const navigate = useNavigate();

    const handleSubmit = async () => {
        const response = await fetch('http://localhost:5000/community/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, description, username })
        });
        const data = await response.json();
        if (response.ok) {
            navigate('/feed');
        } else {
            alert(data.message);
        }
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
            <div className="create-community">
                <h2>Create Community</h2>
                <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <textarea
                    placeholder="Description (250 characters max)"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    maxLength="250"
                />
                <button onClick={handleSubmit}>Create</button>
                <button onClick={() => navigate('/feed')}>Back to Feed</button>
            </div>
        </div>
    );
};


export default CreateCommunity;
