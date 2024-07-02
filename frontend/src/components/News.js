import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import logo from '../logo.png';
import '../styles/news.scss';

const API_KEY = 'b312ae4063cd4f9c9edd9526c11235db';

const News = () => {
    const { category } = useParams();
    const [articles, setArticles] = useState([]);
    const username = localStorage.getItem('username');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const response = await fetch(`https://newsapi.org/v2/top-headlines?category=${category}&language=en&apiKey=${API_KEY}`);
                const data = await response.json();
                setArticles(data.articles);
            } catch (error) {
                console.error('Error fetching news:', error);
            }
        };

        fetchNews();
    }, [category]);

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
        <div>
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
            <div className="news-container">
                <h2>{category.charAt(0).toUpperCase() + category.slice(1)} News</h2>
                <ul className="news-list">
                    {articles.map((article, index) => (
                        <li key={index} className="news-item">
                            <h3>{article.title}</h3>
                            <p>{article.description}</p>
                            {article.urlToImage && <img src={article.urlToImage} alt={article.title} />}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default News;
