import { useState } from 'react';
import { useGetCommentsForChangeRequestQuery, useAddCommentToChangeRequestMutation, useDeleteCommentFromChangeRequestMutation } from '../features/changes/changeRequestsApiSlice';
import useAuth from '../hooks/useAuth';

const HistoryCommentsTab = ({ changeRequestId, history }) => {
    const [commentText, setCommentText] = useState('');
    const { id} = useAuth();

    const {
        data: comments,
        isLoading: isCommentsLoading,
        isError: isCommentsError,
        error: commentsError
    } = useGetCommentsForChangeRequestQuery(changeRequestId);

    const [addComment, { isLoading: isAdding }] = useAddCommentToChangeRequestMutation();
    const [deleteComment] = useDeleteCommentFromChangeRequestMutation();

    const handleAddComment = async (e) => {
        e.preventDefault();
        if (!commentText.trim()) return;
        const commentdata ={
            changeRequestId,
            text:commentText,
            postedBy:id
        }
        console.log(commentText)
        console.log(id)
        await addComment(commentdata);
        setCommentText('');
    };

    const handleDeleteComment = async (commentId) => {
        await deleteComment({ changeRequestId, commentId });
    };

    if (isCommentsLoading) return <p>Loading comments...</p>;
    if (isCommentsError) return <p>Error loading comments: {commentsError?.data?.message || "Could not load comments"}</p>;

    return (
        <div className="change-request-history-comments">
            <div className="history-log">
                <h3>Change Request History</h3>
                <ul className="list-group">
                    {history.map((entry, index) => (
                        <li key={index} className="list-group-item">{entry}</li>
                    ))}
                </ul>
            </div>

            <div className="comments-section">
                <h3>Comments</h3>
                <div className="comments-list">
                    {comments?.map((comment) => (
                        <div key={comment._id} className="comment">
                            <p className="comment-author">{comment.postedBy.firstName} {comment.postedBy.surname} - <small>{new Date(comment.postedDate).toLocaleDateString()}</small></p>
                            <p className="comment-text">"{comment.text}"</p>
                            {comment.postedBy._id === id && (
                                <button className="btn btn-danger" onClick={() => handleDeleteComment(comment._id)}>
                                    Delete
                                </button>
                            )}
                        </div>
                    ))}
                </div>
                <form className="new-comment-form" onSubmit={handleAddComment}>
                    <textarea className="form-control" placeholder="Write a comment..." rows="3" value={commentText} onChange={(e) => setCommentText(e.target.value)}></textarea>
                    <button type="submit" className="btn btn-primary mt-2" disabled={isAdding}>Post Comment</button>
                </form>
            </div>
        </div>
    );
};

export default HistoryCommentsTab;