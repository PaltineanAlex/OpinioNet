import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

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
        <div className="w-64 bg-white shadow-md rounded-lg p-4 flex flex-col space-y-4 mt-4 ml-4 self-start">
            <h2 className="text-2xl font-bold mb-4">Community Tab</h2>
            <input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button onClick={handleSearch} className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition duration-200">
                Search
            </button>
            <button onClick={handleCreate} className="w-full py-2 px-4 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition duration-200">
                Create
            </button>
            <div className="search-results">
                <h3 className="text-xl font-bold mt-4">Search Results</h3>
                <ul className="space-y-2">
                    {searchResults.map((community) => (
                        <li key={community.id}>
                            <button onClick={() => handleCommunityClick(community.name)} className="w-full text-left px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg">
                                {community.name}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="joined-communities">
                <h3 className="text-xl font-bold mt-4">Joined Communities</h3>
                <ul className="space-y-2">
                    {joinedCommunities.map((community) => (
                        <li key={community.id}>
                            <button onClick={() => handleCommunityClick(community.name)} className="w-full text-left px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg">
                                {community.name}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="news-categories">
                <h3 className="text-xl font-bold mt-4">News Categories</h3>
                <ul className="space-y-2">
                    <li><button onClick={() => handleNewsCategoryClick('business')} className="w-full text-left px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg">Business</button></li>
                    <li><button onClick={() => handleNewsCategoryClick('sports')} className="w-full text-left px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg">Sports</button></li>
                    <li><button onClick={() => handleNewsCategoryClick('technology')} className="w-full text-left px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg">Tech</button></li>
                    <li><button onClick={() => handleNewsCategoryClick('politics')} className="w-full text-left px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg">Politics</button></li>
                    <li><button onClick={() => handleNewsCategoryClick('entertainment')} className="w-full text-left px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg">Entertainment</button></li>
                </ul>
            </div>
        </div>
    );
};

export default CommunitySidebar;
