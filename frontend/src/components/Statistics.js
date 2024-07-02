import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { useNavigate } from 'react-router-dom';
import logo from '../logo.png';

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

    if (!data) {
        return <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-500 text-white">Loading...</div>;
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
            <div className="pt-24 w-full max-w-4xl">
                <h2 className="text-3xl font-bold mb-6 text-white text-center">Statistics</h2>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <Bar data={chartData} options={{ maintainAspectRatio: true }} />
                </div>
            </div>
        </div>
    );
};

export default Statistics;
