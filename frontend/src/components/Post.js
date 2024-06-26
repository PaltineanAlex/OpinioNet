import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate, Link } from 'react-router-dom';
import logo from '../logo.png';
import '../styles/post.scss';

const Post = () => {
    const { postId } = useParams();
    const [post, setPost] = useState({});
    const [comments, setComments] = useState([]);
    const [comment, setComment] = useState('');
    const [isEditingPost, setIsEditingPost] = useState(false);
    const [isEditingComment, setIsEditingComment] = useState(null); // Track which comment is being edited
    const [newTitle, setNewTitle] = useState('');
    const [newDescription, setNewDescription] = useState('');
    const [newImage, setNewImage] = useState(null);
    const [imageUrl, setImageUrl] = useState('');
    const [editedComment, setEditedComment] = useState(''); // New state for edited comment
    const username = localStorage.getItem('username');
    const navigate = useNavigate();

    const fetchPost = async () => {
        try {
            const response = await fetch(`http://localhost:5000/post/post/${postId}`);
            const text = await response.text();
            const data = JSON.parse(text);
            setPost(data);
            setNewTitle(data.title);
            setNewDescription(data.description);
            setImageUrl(data.image_url);
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

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setNewImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

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

    const handleEditPost = async () => {
        let updatedImageUrl = imageUrl;

        if (newImage) {
            updatedImageUrl = newImage;
        }

        try {
            const response = await fetch('http://localhost:5000/post/update', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ postId, username, title: newTitle, description: newDescription, image_url: updatedImageUrl })
            });
            const data = await response.json();
            if (response.ok) {
                setPost({ ...post, title: newTitle, description: newDescription, image_url: updatedImageUrl });
                setIsEditingPost(false);
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error('Error updating post:', error);
        }
    };

    const handleDeletePost = async () => {
        const confirmed = window.confirm('Are you sure you want to delete this post?');
        if (confirmed) {
            try {
                const response = await fetch('http://localhost:5000/post/delete', {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ postId, username })
                });
                if (response.ok) {
                    navigate('/feed');
                } else {
                    const data = await response.json();
                    alert(data.message);
                }
            } catch (error) {
                console.error('Error deleting post:', error);
            }
        }
    };

    const handleEditComment = async (commentId) => {
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
                setComments(comments.map(comment => comment.id === commentId ? { ...comment, comment: editedComment } : comment));
                setIsEditingComment(null);
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error('Error updating comment:', error);
        }
    };

    const handleDeleteComment = async (commentId) => {
        const confirmed = window.confirm('Are you sure you want to delete this comment?');
        if (confirmed) {
            try {
                const response = await fetch('http://localhost:5000/comment/delete', {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ commentId, username })
                });
                if (response.ok) {
                    setComments(comments.filter(comment => comment.id !== commentId));
                } else {
                    const data = await response.json();
                    alert(data.message);
                }
            } catch (error) {
                console.error('Error deleting comment:', error);
            }
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
            <div className="post-content">
                {isEditingPost ? (
                    <div>
                        <input
                            type="text"
                            value={newTitle}
                            onChange={(e) => setNewTitle(e.target.value)}
                        />
                        <textarea
                            value={newDescription}
                            onChange={(e) => setNewDescription(e.target.value)}
                        />
                        <input type="file" onChange={handleFileChange} />
                        <button onClick={handleEditPost}>Save</button>
                        <button onClick={() => setIsEditingPost(false)}>Cancel</button>
                    </div>
                ) : (
                    <div>
                        <h2>{post.title}</h2>
                        <div className="description-box">
                            <p>{post.description}</p>
                            {post.image_url && <img src={post.image_url} alt="Post" />}
                        </div>
                        {post.username === username && (
                            <div className="button-container">
                                <button onClick={() => setIsEditingPost(true)}>Edit</button>
                                <button onClick={handleDeletePost}>Delete</button>
                            </div>
                        )}
                    </div>
                )}
            </div>
            <div className="comments-section">
                <h3>Comments</h3>
                <ul>
                    {comments.map((comment) => (
                        <li key={comment.id}>
                            {isEditingComment === comment.id ? (
                                <div>
                                    <input
                                        type="text"
                                        value={editedComment}
                                        onChange={(e) => setEditedComment(e.target.value)}
                                    />
                                    <button onClick={() => handleEditComment(comment.id)}>Save</button>
                                    <button onClick={() => setIsEditingComment(null)}>Cancel</button>
                                </div>
                            ) : (
                                <div>
                                    <p>{comment.comment}</p>
                                    {comment.username === username && (
                                        <div className="comment-actions">
                                            <button onClick={() => { setIsEditingComment(comment.id); setEditedComment(comment.comment); }}>Edit</button>
                                            <button onClick={() => handleDeleteComment(comment.id)}>Delete</button>
                                        </div>
                                    )}
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
