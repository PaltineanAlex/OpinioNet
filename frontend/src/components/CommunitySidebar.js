import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/community-sidebar.scss';

const CommunitySidebar = ({ username }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [joinedCommunities, setJoinedCommunities] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchJoinedCommunities();
    }, []);

    const fetchJoinedCommunities = async () => {
        try {
            const response = await fetch(`http://localhost:5000/community/joined/${username}`);
            const data = await response.json();
            if (response.ok) {
                setJoinedCommunities(data);
            } else {
                alert(data.message);
            }
        } catch (error) {
            alert('An error occurred');
        }
    };

    const handleSearch = async () => {
        try {
            const response = await fetch('http://localhost:5000/community/search', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name: searchTerm })
            });
            const data = await response.json();
            if (response.ok) {
                setSearchResults([data]);
            } else {
                alert(data.message);
            }
        } catch (error) {
            alert('An error occurred');
        }
    };

    const handleCreate = () => {
        navigate('/create-community');
    };

    const handleCommunityClick = (communityName) => {
        navigate(`/community/${communityName}`);
    };

    const handleNewsCategoryClick = (category) => {
        navigate(`/news/${category}`);
    };

    return (
        <div className="community-sidebar">
            <h2>Community Tab</h2>
            <input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button onClick={handleSearch}>Search</button>
            <button onClick={handleCreate}>Create</button>
            <div className="search-results">
                <h3>Search Results</h3>
                <ul>
                    {searchResults.map((community) => (
                        <li key={community.id}>
                            <button onClick={() => handleCommunityClick(community.name)} className="community-button">
                                {community.name}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="joined-communities">
                <h3>Joined Communities</h3>
                <ul>
                    {joinedCommunities.map((community) => (
                        <li key={community.id}>
                            <button onClick={() => handleCommunityClick(community.name)} className="community-button">
                                {community.name}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="news-categories">
                <h3>News Categories</h3>
                <ul>
                    <li><button onClick={() => handleNewsCategoryClick('business')} className="news-category-button">Business</button></li>
                    <li><button onClick={() => handleNewsCategoryClick('sports')} className="news-category-button">Sports</button></li>
                    <li><button onClick={() => handleNewsCategoryClick('technology')} className="news-category-button">Tech</button></li>
                    <li><button onClick={() => handleNewsCategoryClick('politics')} className="news-category-button">Politics</button></li>
                    <li><button onClick={() => handleNewsCategoryClick('entertainment')} className="news-category-button">Entertainment</button></li>
                </ul>
            </div>
        </div>
    );
};

export default CommunitySidebar;
