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
        <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-500 flex flex-col items-center">
            <header className="w-full bg-gradient-to-r from-blue-600 to-purple-600 fixed top-0 left-0 flex justify-between items-center px-6 py-4 shadow-md z-50">
                <div className="flex items-center">
                    <img src={logo} alt="OpinioNet Logo" className="w-12 h-12" />
                    <h1 className="text-2xl text-white font-bold ml-2">OpinioNet</h1>
                </div>
                <p className="text-lg text-gray-200">Connect, Share, Inspire</p>
            </header>
            <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md mt-24">
                <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Register</h2>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-4 py-2 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2 mb-6 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="flex justify-between items-center">
                    <button
                        onClick={handleRegister}
                        className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition duration-200"
                    >
                        Register
                    </button>
                </div>
                <div className="mt-4 text-center">
                    <button
                        onClick={() => navigate('/')}
                        className="text-blue-500 hover:underline"
                    >
                        Back to Login
                    </button>
                </div>
            </div>
            <footer className="mt-8 text-gray-200">
                Created by Păltinean Alex, GitHub repo: <a href="https://github.com/your-github-repo" className="underline">OpinioNet</a>
            </footer>
        </div>
    );
};

export default Register;
