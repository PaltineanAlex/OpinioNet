import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import logo from '../logo.png';

const Post = () => {
    const { postId } = useParams();
    const [post, setPost] = useState({});
    const [comments, setComments] = useState([]);
    const [comment, setComment] = useState('');
    const [isEditingPost, setIsEditingPost] = useState(false);
    const [isEditingComment, setIsEditingComment] = useState(null); 
    const [newTitle, setNewTitle] = useState('');
    const [newDescription, setNewDescription] = useState('');
    const [newImage, setNewImage] = useState(null);
    const [imageUrl, setImageUrl] = useState('');
    const [editedComment, setEditedComment] = useState('');
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

    const handleReport = async (type, contentId) => {
        const reason = prompt("Please enter the reason for reporting:");
        if (reason) {
            try {
                const response = await fetch('http://localhost:5000/report/create', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ type, contentId, reporter: username, reason })
                });
                if (response.ok) {
                    alert('Report submitted successfully.');
                } else {
                    const data = await response.json();
                    alert(data.message);
                }
            } catch (error) {
                console.error('Error submitting report:', error);
                alert('An error occurred while submitting the report.');
            }
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
                {isEditingPost ? (
                    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                        <input
                            type="text"
                            value={newTitle}
                            onChange={(e) => setNewTitle(e.target.value)}
                            className="w-full px-4 py-2 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <textarea
                            value={newDescription}
                            onChange={(e) => setNewDescription(e.target.value)}
                            className="w-full px-4 py-2 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <input type="file" onChange={handleFileChange} className="mb-4" />
                        <div className="flex space-x-4">
                            <button onClick={handleEditPost} className="w-full py-2 px-4 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition duration-200">Save</button>
                            <button onClick={() => setIsEditingPost(false)} className="w-full py-2 px-4 bg-gray-500 text-white font-semibold rounded-lg hover:bg-gray-600 transition duration-200">Cancel</button>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                        <h2 className="text-3xl font-bold mb-4">{post.title}</h2>
                        <div className="mb-4">
                            <p className="text-gray-700">{post.description}</p>
                            {post.image_url && <img src={post.image_url} alt="Post" className="mt-4 rounded-lg mx-auto" />}
                        </div>
                        <div className="flex space-x-4">
                            <button onClick={() => handleReport('post', post.id)} className="w-full py-2 px-4 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition duration-200">Report Post</button>
                            {post.username === username && (
                                <>
                                    <button onClick={() => setIsEditingPost(true)} className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition duration-200">Edit</button>
                                    <button onClick={handleDeletePost} className="w-full py-2 px-4 bg-gray-500 text-white font-semibold rounded-lg hover:bg-gray-600 transition duration-200">Delete</button>
                                </>
                            )}
                        </div>
                    </div>
                )}
                <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                    <h3 className="text-2xl font-bold mb-4">Comments</h3>
                    <ul className="space-y-4">
                        {comments.map((comment) => (
                            <li key={comment.id} className="bg-gray-100 p-4 rounded-lg shadow-md">
                                {isEditingComment === comment.id ? (
                                    <div className="flex space-x-4">
                                        <input
                                            type="text"
                                            value={editedComment}
                                            onChange={(e) => setEditedComment(e.target.value)}
                                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                        <button onClick={() => handleEditComment(comment.id)} className="py-2 px-4 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition duration-200">Save</button>
                                        <button onClick={() => setIsEditingComment(null)} className="py-2 px-4 bg-gray-500 text-white font-semibold rounded-lg hover:bg-gray-600 transition duration-200">Cancel</button>
                                    </div>
                                ) : (
                                    <div>
                                        <p className="text-gray-700">{comment.comment}</p>
                                        <div className="flex space-x-4 mt-2">
                                            <button onClick={() => handleReport('comment', comment.id)} className="py-2 px-4 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition duration-200">Report Comment</button>
                                            {comment.username === username && (
                                                <>
                                                    <button onClick={() => { setIsEditingComment(comment.id); setEditedComment(comment.comment); }} className="py-2 px-4 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition duration-200">Edit</button>
                                                    <button onClick={() => handleDeleteComment(comment.id)} className="py-2 px-4 bg-gray-500 text-white font-semibold rounded-lg hover:bg-gray-600 transition duration-200">Delete</button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                    <div className="flex space-x-4 mt-4">
                        <input
                            type="text"
                            placeholder="Add a comment"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button onClick={handleCommentSubmit} className="py-2 px-4 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition duration-200">Submit</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Post;
