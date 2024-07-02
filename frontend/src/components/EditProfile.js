import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../logo.png';
import '../styles/edit-profile.scss';

const EditProfile = () => {
    const [newUsername, setNewUsername] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const currentUsername = localStorage.getItem('username');
    const navigate = useNavigate();

    const handleSave = async () => {
        try {
            const response = await fetch('http://localhost:5000/auth/update', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    currentUsername,
                    newUsername: newUsername || currentUsername,
                    newPassword,
                    newEmail
                })
            });
            const data = await response.json();
            if (response.ok) {
                localStorage.setItem('username', newUsername || currentUsername);
                navigate('/feed');
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error('Error updating profile:', error);
        }
    };

    const handleCancel = () => {
        navigate('/feed');
    };

    return (
        <div className="edit-profile-container">
            <header>
                <img src={logo} alt="OpinioNet Logo" />
                <h1>OpinioNet</h1>
                <p>Connect, Share, Inspire</p>
            </header>
            <div className="edit-profile">
                <h2>Edit Profile</h2>
                <input
                    type="text"
                    placeholder="New Username"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                />
                <input
                    type="email"
                    placeholder="New Email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                />
                <button onClick={handleSave}>Save</button>
                <button onClick={handleCancel}>Cancel</button>
            </div>
        </div>
    );
};

export default EditProfile;
