import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import '../styles/chat.scss';
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
        <div className="chat-container">
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
            <div className="messages">
                <h2>Live Chat Room</h2>
                {messages.map((msg, index) => (
                    <div key={index} className={`message ${msg.username ? '' : 'notification'}`}>
                        {msg.username ? <strong>{msg.username}: </strong> : <em>{msg.text}</em>}
                        {msg.username && msg.text}
                    </div>
                ))}
            </div>
            <form onSubmit={handleSubmit} className="chat-form">
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message here..."
                />
                <button type="submit" className="submit-button">Send</button>
            </form>
        </div>
    );
};

export default Chat;
