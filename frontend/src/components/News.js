import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import logo from '../logo.png';
import '../styles/news.scss';

const API_KEY = 'b312ae4063cd4f9c9edd9526c11235db';

const News = () => {
    const { category } = useParams();
    const [articles, setArticles] = useState([]);

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

    return (
        <div>
            <header>
                <img src={logo} alt="OpinioNet Logo" />
                <h1>OpinioNet</h1>
                <p>Connect, Share, Inspire</p>
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
