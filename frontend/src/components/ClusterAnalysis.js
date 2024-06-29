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
        return {
            datasets: clusters.map((cluster, index) => ({
                label: `Cluster ${index + 1}`,
                data: cluster.users.map(user => ({ x: user.post_count, y: user.comment_count })),
                backgroundColor: `rgba(${index * 50}, ${100 + index * 50}, ${150 + index * 50}, 0.7)`,
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
                                                }
                                            },
                                            y: {
                                                title: {
                                                    display: true,
                                                    text: 'Number of Comments'
                                                }
                                            }
                                        },
                                        plugins: {
                                            legend: {
                                                position: 'top'
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
