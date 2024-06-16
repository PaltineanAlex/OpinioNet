import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import logo from '../logo.png';

const CreatePost = () => {
    const { communityName } = useParams();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const username = localStorage.getItem('username');
    const navigate = useNavigate();

    const handleSubmit = async () => {
        console.log('Submitting Post:', { communityName, username, title, description });
        const response = await fetch('http://localhost:5000/post/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ communityName, username, title, description })
        });
        const data = await response.json();
        if (response.ok) {
            navigate(`/community/${communityName}`);
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
                <button onClick={handleSubmit}>Create Post</button>
                <button onClick={() => navigate(`/community/${communityName}`)}>Back to Community</button>
            </div>
        </div>
    );
};

export default CreatePost;
