import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import logo from '../logo.png';
import '../styles/report-management.scss';

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

    return (
        <div className="report-management-page">
            <header className="feed-header">
                <div className="logo-container">
                    <img src={logo} alt="OpinioNet Logo" className="logo" />
                    <Link to="/feed">
                        <h1>OpinioNet</h1>
                    </Link>
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
            <div className="report-content">
                <h2>Reported Content</h2>
                {error ? (
                    <p>{error}</p>
                ) : (
                    reports.length > 0 ? (
                        <ul>
                            {reports.map((report) => (
                                <li key={report.id}>
                                    <p><strong>Reporter:</strong> {report.reporter}</p>
                                    <p><strong>Reason:</strong> {report.reason}</p>
                                    <p>
                                        <strong>Content:</strong> {report.type === 'post' ? (
                                            <Link to={`/post/${report.content_id}`}>{report.post_title}</Link>
                                        ) : (
                                            <span>{report.comment_text}</span>
                                        )}
                                    </p>
                                    <div className="report-actions">
                                        <button onClick={() => handleResolveReport(report.id, 'delete')}>Delete Content</button>
                                        <button onClick={() => handleResolveReport(report.id, 'ignore')}>Ignore</button>
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
    );
};

export default ReportManagement;
