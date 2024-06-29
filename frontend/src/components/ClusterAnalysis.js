import React, { useEffect, useState } from 'react';
import { Scatter } from 'react-chartjs-2';
import 'chart.js/auto';
import logo from '../logo.png';
import '../styles/cluster-analysis.scss';

const ClusterAnalysis = () => {
    const [clusters, setClusters] = useState([]);
    const [error, setError] = useState(null);

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
            'rgba(255, 99, 132, 0.7)', // Red
            'rgba(54, 162, 235, 0.7)', // Blue
            'rgba(75, 192, 192, 0.7)', // Green
            'rgba(255, 206, 86, 0.7)', // Yellow
            'rgba(153, 102, 255, 0.7)', // Purple
            'rgba(255, 159, 64, 0.7)', // Orange
            // Add more colors if needed
        ];

        return {
            datasets: clusters.map((cluster, index) => ({
                label: `Cluster ${index + 1}`,
                data: cluster.users.map(user => ({ x: user.post_count, y: user.comment_count })),
                backgroundColor: clusterColors[index % clusterColors.length],
                pointRadius: 5,
                pointHoverRadius: 8,
                borderColor: clusterColors[index % clusterColors.length].replace('0.7', '1'),
                borderWidth: 1
            }))
        };
    };

    const getClusterSummary = (cluster) => {
        const totalPosts = cluster.users.reduce((sum, user) => sum + user.post_count, 0);
        const totalComments = cluster.users.reduce((sum, user) => sum + user.comment_count, 0);
        const numUsers = cluster.users.length;
        return `This cluster contains ${numUsers} user(s) with a total of ${totalPosts} posts and ${totalComments} comments.`;
    };

    return (
        <div>
            <header className="cluster-analysis-header">
                <div className="logo-container">
                    <img src={logo} alt="OpinioNet Logo" />
                    <h1>OpinioNet</h1>
                </div>
                <p className="tagline">Connect, Share, Inspire</p>
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
                                                    text: 'Number of Posts'
                                                },
                                                grid: {
                                                    color: 'rgba(200, 200, 200, 0.2)'
                                                }
                                            },
                                            y: {
                                                title: {
                                                    display: true,
                                                    text: 'Number of Comments'
                                                },
                                                grid: {
                                                    color: 'rgba(200, 200, 200, 0.2)'
                                                }
                                            }
                                        },
                                        plugins: {
                                            legend: {
                                                position: 'top'
                                            },
                                            tooltip: {
                                                callbacks: {
                                                    label: function(context) {
                                                        const user = clusters[context.datasetIndex].users[context.dataIndex];
                                                        return `${user.username}: ${user.post_count} posts, ${user.comment_count} comments`;
                                                    }
                                                }
                                            }
                                        }
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
                                <p>The scatter plot above shows the distribution of users in different clusters based on their number of posts and comments. Each cluster is represented by a different color, and you can see how users are grouped based on their activity levels.</p>
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
