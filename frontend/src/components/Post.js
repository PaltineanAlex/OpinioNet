import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const Post = () => {
    const { postId } = useParams();
    const [post, setPost] = useState({});
    const [comments, setComments] = useState([]);
    const [comment, setComment] = useState('');
    const userId = localStorage.getItem('userId');

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
            const text = await response.text();
            console.log('Response Text:', text); // Log the raw response
            const data = JSON.parse(text);
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
                body: JSON.stringify({ postId, userId, comment })
            });
            const text = await response.text();
            console.log('Response Text:', text); // Log the raw response
            const data = JSON.parse(text);
            setComments([...comments, data]);
            setComment('');
        } catch (error) {
            console.error('Error submitting comment:', error);
        }
    };

    return (
        <div className="post-page">
            <h2>{post.title}</h2>
            <p>{post.description}</p>
            <div className="comments-section">
                <h3>Comments</h3>
                <ul>
                    {comments.map((comment) => (
                        <li key={comment.id}>{comment.comment}</li>
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
