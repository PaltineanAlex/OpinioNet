import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import logo from '../logo.png';

let socket;

const Chat = () => {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const username = localStorage.getItem('username');
    const navigate = useNavigate();

    useEffect(() => {
        socket = io('http://localhost:5000', {
            query: { username }
        });

        socket.on('connect', () => {
            socket.emit('join', { username });
        });

        socket.on('chat message', (msg) => {
            setMessages((prevMessages) => [...prevMessages, msg]);
        });

        socket.on('notification', (notif) => {
            setMessages((prevMessages) => [...prevMessages, notif]);
        });

        return () => {
            socket.emit('leave', { username });
            socket.disconnect();
        };
    }, [username]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (message.trim()) {
            const msg = { username, text: message };
            socket.emit('chat message', msg);
            setMessage('');
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
        <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-500 flex flex-col items-center">
            <header className="w-full bg-gradient-to-r from-blue-600 to-purple-600 fixed top-0 left-0 flex justify-between items-center px-6 py-4 shadow-md z-50">
                <div className="flex items-center">
                    <img src={logo} alt="OpinioNet Logo" className="w-12 h-12" />
                    <h1 className="text-2xl text-white font-bold ml-2">OpinioNet</h1>
                </div>
                <div className="relative group">
                    <button className="text-white font-semibold">{username}</button>
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <button onClick={handleEditProfile} className="block px-4 py-2 text-gray-800 hover:bg-gray-200 w-full text-left">Edit Profile</button>
                        <button onClick={handleDeleteProfile} className="block px-4 py-2 text-gray-800 hover:bg-gray-200 w-full text-left">Delete Profile</button>
                        <button onClick={handleLogout} className="block px-4 py-2 text-gray-800 hover:bg-gray-200 w-full text-left">Log Out</button>
                    </div>
                </div>
            </header>
            <div className="pt-24 w-full max-w-4xl flex flex-col items-center">
                <div className="bg-white p-6 rounded-lg shadow-md w-full mb-6">
                    <h2 className="text-3xl font-bold mb-4">Live Chat Room</h2>
                    <div className="messages space-y-4 mb-4 h-96 overflow-y-auto">
                        {messages.map((msg, index) => (
                            <div key={index} className={`p-2 rounded-lg ${msg.username ? 'bg-gray-100' : 'bg-yellow-100'} shadow-sm`}>
                                {msg.username ? <strong>{msg.username}: </strong> : <em>{msg.text}</em>}
                                {msg.username && msg.text}
                            </div>
                        ))}
                    </div>
                    <form onSubmit={handleSubmit} className="flex space-x-4 w-full">
                        <input
                            type="text"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Type your message here..."
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button type="submit" className="py-2 px-4 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition duration-200">Send</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Chat;
