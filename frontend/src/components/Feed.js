import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Feed = () => {
    const [username, setUsername] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('http://localhost:5000/user/profile', {
                    headers: { 'Authorization': token }
                });
                const data = await response.json();
                if (response.ok) {
                    setUsername(data.username);
                } else {
                    navigate('/');
                }
            } catch (error) {
                navigate('/');
            }
        };

        fetchProfile();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    return (
        <div>
            <h2>Feed</h2>
            <div style={{ position: 'absolute', top: '10px', right: '10px' }}>
                <span>{username}</span>
                <button onClick={handleLogout}>Log out</button>
            </div>
        </div>
    );
};

export default Feed;
