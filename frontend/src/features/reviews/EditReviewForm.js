import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUpdateReviewMutation, useGetReviewByIdQuery, useDeleteReviewMutation } from './reviewsApiSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faTrashCan } from "@fortawesome/free-solid-svg-icons";

const EditReviewForm = ({ review }) => {
    const navigate = useNavigate();
    const [updateReview] = useUpdateReviewMutation();
    const [deleteReview] = useDeleteReviewMutation();
    // const {
    //     data: reviews,
    //     isLoading,
    //     isError,
    //     error
    // } = useGetReviewsByProjectIdQuery(review.projectId);

    const [onModel, setOnModel] = useState(review.onModel);
    const [description, setDescription] = useState(review.description);
    const [status, setStatus] = useState(review.status);
    const [reviewers, setReviewers] = useState(review.reviewers);
    const [initiationDate, setInitiationDate] = useState(review.initiationDate);
    
    // useEffect(() => {
    //     if (reviews && review) {
    //         // Set state here if needed
    //     }
    // }, [reviews, review]);

    const onSaveChanges = async () => {
        try {
            const updatedData = {
                onModel,
                description,
                status,
                reviewers,
                initiationDate
            };
            await updateReview({ id: review._id, ...updatedData }).unwrap();
            navigate('/admin-dashboard/reviews');
        } catch (error) {
            console.error('Failed to update the review:', error);
        }
    };

    const onDeleteReview = async () => {
        try {
            await deleteReview(review._id).unwrap();
            navigate('/admin-dashboard/reviews');
        } catch (error) {
            console.error('Failed to delete the review:', error);
        }
    };    

    // if (isLoading) return <p>Loading...</p>;
    // if (isError) return <p>Error: {error.data.message}</p>;

    return (
        <div className="container mt-3">
            <h2>Edit Review</h2>
            <form>
                <div className="mb-3">
                    <label htmlFor="onModel" className="form-label">Review Type:</label>
                    <select className="form-select" id="onModel" value={onModel} onChange={e => setOnModel(e.target.value)}>
                        <option value="Document">Document</option>
                        <option value="ChangeRequest">Change Request</option>
                        <option value="Design">Design</option>
                        <option value="Product">Product</option>
                    </select>
                </div>
                <div className="mb-3">
                    <label htmlFor="description" className="form-label">Description:</label>
                    <textarea className="form-control" id="description" value={description} onChange={e => setDescription(e.target.value)} required></textarea>
                </div>
                <div className="mb-3">
                    <label htmlFor="status" className="form-label">Status:</label>
                    <select className="form-select" id="status" value={status} onChange={e => setStatus(e.target.value)}>
                        <option value="In Review">In Review</option>
                        <option value="Completed">Completed</option>
                        <option value="Rejected">Rejected</option>
                    </select>
                </div>
                <div className="mb-3">
                    <label htmlFor="initiationDate" className="form-label">Initiation Date:</label>
                    <input type="date" className="form-control" id="initiationDate" value={new Date(initiationDate).toISOString().split('T')[0]} onChange={e => setInitiationDate(e.target.value)} />
                </div>
                <button type="button" className="btn btn-primary" onClick={onSaveChanges}>
                    <FontAwesomeIcon icon={faSave} /> Save Changes
                </button>
                <button type="button" className="btn btn-danger" onClick={onDeleteReview}>
                    <FontAwesomeIcon icon={faTrashCan} /> Delete Review
                </button>
            </form>
        </div>
    );
};

export default EditReviewForm;
