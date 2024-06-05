// Login.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const response = await fetch('http://localhost:5000/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });
            const data = await response.json();
            if (response.ok) {
                localStorage.setItem('token', data.token);
                navigate('/feed');
            } else {
                alert(data.message);
            }
        } catch (error) {
            alert('An error occurred');
        }
    };

    return (
        <div>
            <header>
                <img src="../logo.png" alt="OpinioNet Logo" />
                <h1>Connect, Share, Inspire</h1>
            </header>
            <div className="container">
                <h2>Login</h2>
                <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <div>
                    <button onClick={handleLogin}>Login</button>
                    <button onClick={() => navigate('/register')}>Create Account</button>
                </div>
            </div>
            <footer>Created by Păltinean Alex, GitHub repo: OpinioNet</footer>
        </div>
    );
};

export default Login;
