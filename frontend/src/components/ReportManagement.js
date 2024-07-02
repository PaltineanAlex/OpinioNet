import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import logo from '../logo.png';

const ReportManagement = () => {
    const { communityId } = useParams();
    const [reports, setReports] = useState([]);
    const [error, setError] = useState(null);
    const username = localStorage.getItem('username');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const response = await fetch(`http://localhost:5000/report/community/${communityId}`);
                const data = await response.json();
                if (response.ok) {
                    setReports(data);
                } else {
                    setError(data.error);
                }
            } catch (error) {
                setError('An error occurred while fetching reports.');
            }
        };

        fetchReports();
    }, [communityId]);

    const handleResolveReport = async (reportId, action) => {
        try {
            const response = await fetch(`http://localhost:5000/report/resolve/${reportId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ action })
            });
            if (response.ok) {
                setReports(reports.filter(report => report.id !== reportId));
            } else {
                const data = await response.json();
                alert(data.message);
            }
        } catch (error) {
            console.error('Error resolving report:', error);
            alert('An error occurred while resolving the report.');
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
                    <Link to="/feed" className="text-2xl text-white font-bold ml-2">OpinioNet</Link>
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
                <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                    <h2 className="text-3xl font-bold mb-4">Reported Content</h2>
                    {error ? (
                        <p className="text-red-500">{error}</p>
                    ) : (
                        reports.length > 0 ? (
                            <ul className="space-y-4">
                                {reports.map((report) => (
                                    <li key={report.id} className="bg-gray-100 p-4 rounded-lg shadow-md">
                                        <p className="mb-2"><strong>Reporter:</strong> {report.reporter}</p>
                                        <p className="mb-2"><strong>Reason:</strong> {report.reason}</p>
                                        <p className="mb-4">
                                            <strong>Content:</strong> {report.type === 'post' ? (
                                                <Link to={`/post/${report.content_id}`} className="text-blue-600 hover:underline">{report.post_title}</Link>
                                            ) : (
                                                <span>{report.comment_text}</span>
                                            )}
                                        </p>
                                        <div className="flex space-x-4">
                                            <button onClick={() => handleResolveReport(report.id, 'delete')} className="py-2 px-4 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition duration-200">Delete Content</button>
                                            <button onClick={() => handleResolveReport(report.id, 'ignore')} className="py-2 px-4 bg-gray-500 text-white font-semibold rounded-lg hover:bg-gray-600 transition duration-200">Ignore</button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>No reports found.</p>
                        )
                    )}
                </div>
            </div>
        </div>
    );
};

export default ReportManagement;
