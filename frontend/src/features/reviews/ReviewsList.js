import React from 'react';
import { useNavigate } from "react-router-dom";
import { useGetReviewsQuery } from './reviewsApiSlice';
import Review from './Review';
import LoadingSpinner from "../../components/LoadingSpinner";
import useAuth from '../../hooks/useAuth';

const ReviewsList = () => {
    const navigate = useNavigate();
    const {isAdmin, isReviewManager} = useAuth()
    const { 
        data: reviews, 
        isLoading, 
        isError, 
        error } = useGetReviewsQuery('reviewList', {
            pollingInterval: 60000,
            refetchOnFocus: true,
            refetchOnMountOrArgChange: true
        })

    const handleCreateNewReview = () => {
        navigate('/admin-dashboard/reviews/create');
    };

    if (isLoading) return <LoadingSpinner />;
    if (isError) {
      if (error.status === 400 && error.data.message === 'No reviews found') {
        return (
          <div className="container mt-5">
            <h2>{error.data.message}</h2>
            {(isAdmin || isReviewManager) && (
              <button className="btn btn-primary" onClick={handleCreateNewReview}>
                Create New Review
              </button>
            )}
          </div>
        );
      }
      return <p>Error: {error.data.message}</p>;
    }
      
    const canEdit = isAdmin || isReviewManager;
    return (
        <div>
            <button onClick={handleCreateNewReview} className="btn btn-success mb-3">
                Create New Review
            </button>
            <table className="table">
                <thead className="thead-dark">
                    <tr>
                        <th scope="col">Review ID</th>
                        <th scope="col">Item Reviewed</th>
                        <th scope="col">Type</th>
                        <th scope="col">Status</th>
                        <th scope="col">Initiation Date</th>
                        <th scope="col">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {reviews.ids.map(reviewId => (
                        <Review 
                            key={reviewId} 
                            review={reviews.entities[reviewId]} 
                            canEdit={canEdit}
                        />
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ReviewsList;