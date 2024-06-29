import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import '../styles/chat.scss';
import logo from '../logo.png';

let socket;

const Chat = () => {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const username = localStorage.getItem('username');

    useEffect(() => {
        socket = io('http://localhost:5000', {
            query: { username }
        }); // Adjust the URL as necessary

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

    return (
        <div className="chat-container">
            <header>
                <img src={logo} alt="OpinioNet Logo" />
                <h1>OpinioNet</h1>
                <p>Connect, Share, Inspire</p>
            </header>
            <div className="messages">
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
