import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../logo.png';

const Register = () => {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleRegister = async () => {
        try {
            const response = await fetch('http://localhost:5000/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, username, password })
            });
            const data = await response.json();
            if (response.ok) {
                navigate('/');
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
                <img src={logo} alt="OpinioNet Logo" />
                <h1>OpinioNet</h1>
                <p>Connect, Share, Inspire</p>
            </header>
            <div className="container">
                <h2>Register</h2>
                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <div>
                    <button onClick={handleRegister}>Register</button>
                    <button onClick={() => navigate('/')}>Back to Login</button>
                </div>
            </div>
            <footer>Created by Păltinean Alex, GitHub repo: OpinioNet</footer>
        </div>
    );
};

export default Register;
