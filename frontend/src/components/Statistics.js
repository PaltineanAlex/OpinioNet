import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { useNavigate } from 'react-router-dom';
import logo from '../logo.png';
import '../styles/statistics.scss';

// Register the required components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Statistics = () => {
    const [data, setData] = useState(null);
    const username = localStorage.getItem('username');
    const navigate = useNavigate();

    const fetchStatistics = async () => {
        try {
            const response = await fetch('http://localhost:5000/statistics');
            const data = await response.json();
            setData(data);
        } catch (error) {
            console.error('Error fetching statistics:', error);
        }
    };

    useEffect(() => {
        fetchStatistics();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('username');
        localStorage.removeItem('token');
        navigate('/');
    };

    if (!data) {
        return <div>Loading...</div>;
    }

    const chartData = {
        labels: ['Users', 'Communities', 'Posts', 'Comments'],
        datasets: [
            {
                label: '# of Entries',
                data: [data.userCount, data.communityCount, data.postCount, data.commentCount],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)'
                ],
                borderWidth: 1
            }
        ]
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
                            <button onClick={handleLogout}>Log Out</button>
                        </div>
                    </div>
                </div>
            </header>
            <div className="statistics-container">
                <h2>Statistics</h2>
                <Bar data={chartData} options={{ maintainAspectRatio: true }} />
            </div>
        </div>
    );
};

export default Statistics;
