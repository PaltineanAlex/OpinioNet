import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Scatter } from 'react-chartjs-2';
import { Chart } from 'chart.js';
import 'chart.js/auto';
import logo from '../logo.png';
import '../styles/cluster-analysis.scss';

const getConvexHull = (points) => {
    points = points.slice().sort((a, b) => a.x - b.x || a.y - b.y);

    const cross = (o, a, b) => (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);

    const lower = [];
    for (let point of points) {
        while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], point) <= 0) {
            lower.pop();
        }
        lower.push(point);
    }

    const upper = [];
    for (let point of points.reverse()) {
        while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], point) <= 0) {
            upper.pop();
        }
        upper.push(point);
    }

    upper.pop();
    lower.pop();
    return lower.concat(upper);
};

const ClusterAnalysis = () => {
    const [clusters, setClusters] = useState([]);
    const [error, setError] = useState(null);
    const username = localStorage.getItem('username');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchClusters = async () => {
            try {
                const response = await fetch('http://localhost:5000/cluster-analysis');
                const data = await response.json();
                console.log('Fetched Clusters:', data);

                if (response.ok) {
                    setClusters(data.clusters);
                } else {
                    setError(data.error);
                }
            } catch (error) {
                console.error('Fetch error:', error);
                setError('An error occurred while fetching clusters.');
            }
        };

        fetchClusters();
    }, []);

    const generateScatterData = () => {
        const clusterColors = [
            { real: 'rgba(255, 99, 132, 0.7)', dummy: 'rgba(255, 99, 132, 0.3)' },
            { real: 'rgba(54, 162, 235, 0.7)', dummy: 'rgba(54, 162, 235, 0.3)' },
            { real: 'rgba(75, 192, 192, 0.7)', dummy: 'rgba(75, 192, 192, 0.3)' },
            { real: 'rgba(255, 206, 86, 0.7)', dummy: 'rgba(255, 206, 86, 0.3)' }, 
            { real: 'rgba(153, 102, 255, 0.7)', dummy: 'rgba(153, 102, 255, 0.3)' },
            { real: 'rgba(255, 159, 64, 0.7)', dummy: 'rgba(255, 159, 64, 0.3)' },
        ];

        return {
            datasets: clusters.map((cluster, index) => ({
                label: `Cluster ${index + 1}`,
                data: cluster.users.map(user => ({
                    x: user.post_count,
                    y: user.comment_count,
                    isReal: user.is_real,
                })),
                backgroundColor: cluster.users.map(user => user.is_real ? clusterColors[index % clusterColors.length].real : clusterColors[index % clusterColors.length].dummy),
                pointRadius: 5,
                pointHoverRadius: 8,
                borderColor: clusterColors[index % clusterColors.length].real.replace('0.7', '1'),
                borderWidth: 1,
            })),
        };
    };

    const getClusterSummary = (cluster) => {
        const totalPosts = cluster.users.reduce((sum, user) => sum + user.post_count, 0);
        const totalComments = cluster.users.reduce((sum, user) => sum + user.comment_count, 0);
        const numUsers = cluster.users.length;
        return `This cluster contains ${numUsers} user(s) with a total of ${totalPosts} posts and ${totalComments} comments.`;
    };

    const handleLogout = () => {
        localStorage.removeItem('username');
        localStorage.removeItem('token');
        navigate('/');
    };

    useEffect(() => {
        const plugin = {
            id: 'convexHull',
            afterDatasetsDraw: (chart) => {
                const ctx = chart.ctx;
                chart.data.datasets.forEach((dataset, index) => {
                    const points = dataset.data.map(point => ({
                        x: chart.scales.x.getPixelForValue(point.x),
                        y: chart.scales.y.getPixelForValue(point.y),
                    }));
                    const hull = getConvexHull(points);
                    ctx.beginPath();
                    ctx.strokeStyle = dataset.borderColor;
                    ctx.lineWidth = 2;
                    ctx.moveTo(hull[0].x, hull[0].y);
                    for (let i = 1; i < hull.length; i++) {
                        ctx.lineTo(hull[i].x, hull[i].y);
                    }
                    ctx.closePath();
                    ctx.stroke();
                });
            },
        };
        Chart.register(plugin);
    }, []);

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
            <div className="cluster-analysis-container">
                <h2>Cluster Analysis</h2>
                {error ? (
                    <p>{error}</p>
                ) : (
                    clusters.length > 0 ? (
                        <>
                            <div className="scatter-plot">
                                <Scatter
                                    data={generateScatterData()}
                                    options={{
                                        scales: {
                                            x: {
                                                type: 'linear',
                                                position: 'bottom',
                                                title: {
                                                    display: true,
                                                    text: 'Number of Posts',
                                                },
                                                grid: {
                                                    color: 'rgba(200, 200, 200, 0.2)',
                                                },
                                            },
                                            y: {
                                                title: {
                                                    display: true,
                                                    text: 'Number of Comments',
                                                },
                                                grid: {
                                                    color: 'rgba(200, 200, 200, 0.2)',
                                                },
                                            },
                                        },
                                        plugins: {
                                            legend: {
                                                position: 'top',
                                            },
                                            tooltip: {
                                                callbacks: {
                                                    label: function (context) {
                                                        const user = clusters[context.datasetIndex].users[context.dataIndex];
                                                        return `${user.username}: ${user.post_count} posts, ${user.comment_count} comments`;
                                                    },
                                                },
                                            },
                                        },
                                    }}
                                />
                            </div>
                            <div className="analysis">
                                <h3>Analysis of Clusters</h3>
                                <p>Based on the clustering analysis, we have identified the following clusters among the users:</p>
                                <ul>
                                    {clusters.map((cluster, index) => (
                                        <p key={index}>
                                            <strong>Cluster {index + 1}:</strong> {getClusterSummary(cluster)}
                                        </p>
                                    ))}
                                </ul>
                                <p>
                                    The scatter plot above shows the distribution of users in different clusters based on their number of posts and comments. Each cluster is represented by a different color, and you can see how users are grouped based on their activity levels.
                                </p>
                            </div>
                        </>
                    ) : (
                        <p>Loading...</p>
                    )
                )}
            </div>
        </div>
    );
};

export default ClusterAnalysis;
