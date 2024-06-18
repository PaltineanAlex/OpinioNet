import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import logo from '../logo.png';
import { useNavigate } from 'react-router-dom';

const Post = () => {
    const { postId } = useParams();
    const [post, setPost] = useState({});
    const [comments, setComments] = useState([]);
    const [comment, setComment] = useState('');
    const [editingComment, setEditingComment] = useState(null);
    const [editedComment, setEditedComment] = useState('');
    const username = localStorage.getItem('username');
    const navigate = useNavigate();

    const fetchPost = async () => {
        try {
            const response = await fetch(`http://localhost:5000/post/post/${postId}`);
            const text = await response.text();
            console.log('Response Text:', text); // Log the raw response
            const data = JSON.parse(text);
            setPost(data);
        } catch (error) {
            console.error('Error fetching post:', error);
        }
    };

    const fetchComments = async () => {
        try {
            const response = await fetch(`http://localhost:5000/comment/${postId}`);
            const data = await response.json();
            setComments(data);
        } catch (error) {
            console.error('Error fetching comments:', error);
        }
    };

    useEffect(() => {
        fetchPost();
        fetchComments();
    }, []);

    const handleCommentSubmit = async () => {
        try {
            const response = await fetch('http://localhost:5000/comment/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ postId, username, comment })
            });
            const data = await response.json();
            if (response.ok) {
                setComments([...comments, data]);
                setComment('');
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error('Error submitting comment:', error);
        }
    };

    const handleEditComment = (commentId, currentComment) => {
        setEditingComment(commentId);
        setEditedComment(currentComment);
    };

    const handleSaveComment = async (commentId) => {
        try {
            const response = await fetch('http://localhost:5000/comment/update', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ commentId, username, comment: editedComment })
            });
            const data = await response.json();
            if (response.ok) {
                setComments(comments.map(c => c.id === commentId ? { ...c, comment: editedComment } : c));
                setEditingComment(null);
                setEditedComment('');
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error('Error updating comment:', error);
        }
    };

    const handleDeleteComment = async (commentId) => {
        try {
            const response = await fetch('http://localhost:5000/comment/delete', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ commentId, username })
            });
            const data = await response.json();
            if (response.ok) {
                setComments(comments.filter(c => c.id !== commentId));
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error('Error deleting comment:', error);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('username');
        localStorage.removeItem('token');
        navigate('/');
    };

    return (
        <div className="post-page">
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
            <div className="post-content">
                <h2>{post.title}</h2>
                <p>{post.description}</p>
            </div>
            <div className="comments-section">
                <h3>Comments</h3>
                <ul>
                    {comments.map((comment) => (
                        <li key={comment.id}>
                            <p>{comment.comment}</p>
                            {comment.username === username && (
                                <div>
                                    <button onClick={() => handleEditComment(comment.id, comment.comment)}>Edit</button>
                                    <button onClick={() => handleDeleteComment(comment.id)}>Delete</button>
                                </div>
                            )}
                            {editingComment === comment.id && (
                                <div>
                                    <input
                                        type="text"
                                        value={editedComment}
                                        onChange={(e) => setEditedComment(e.target.value)}
                                    />
                                    <button onClick={() => handleSaveComment(comment.id)}>Save</button>
                                    <button onClick={() => setEditingComment(null)}>Cancel</button>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
                <input
                    type="text"
                    placeholder="Add a comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                />
                <button onClick={handleCommentSubmit}>Submit</button>
            </div>
        </div>
    );
};

export default Post;
