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

    return (
        <div>
            <header>
                <img src={logo} alt="OpinioNet Logo" />
                <h1>OpinioNet</h1>
                <p>Connect, Share, Inspire</p>
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
