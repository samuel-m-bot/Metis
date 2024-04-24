import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetReviewByIdQuery, useReviewSubmissionMutation } from './reviewsApiSlice';
import { useLazyGetDocumentByIdQuery } from '../documents/documentsApiSlice';
import { useLazyGetDesignByIdQuery } from '../designs/designsApiSlice';
import { useLazyGetProductByIdQuery } from '../products/productsApiSlice';
import { useLazyGetChangeRequestByIdQuery } from '../changes/changeRequestsApiSlice';

const ReviewTab = ({ task }) => {
  const navigate = useNavigate();
  const reviewId = task.review;
  const { data: review, isLoading: isLoadingReview, isError: isErrorReview, error: errorReview } = useGetReviewByIdQuery(reviewId);
  const [submitReview, { isError: isErrorSubmission, error: errorSubmission }] = useReviewSubmissionMutation();

  // Lazy queries to fetch item details
  const [getDocument] = useLazyGetDocumentByIdQuery();
  const [getDesign] = useLazyGetDesignByIdQuery();
  const [getProduct] = useLazyGetProductByIdQuery();
  const [getChangeRequest] = useLazyGetChangeRequestByIdQuery();

  const handleViewItemClick = async () => {
    let itemData
    switch (review?.onModel) {
      case 'Document':
        itemData = await getDocument(review.itemReviewed).unwrap();
        navigate(`/documents/${review.itemReviewed}`, { state: { itemData } });
        break;
      case 'Design':
        itemData = await getDesign(review.itemReviewed).unwrap();
        navigate(`/designs/${review.itemReviewed}`, { state: { itemData } });
        break;
      case 'Product':
        itemData = await getProduct(review.itemReviewed).unwrap();
        navigate(`/products/${review.itemReviewed}`, { state: { itemData } });
        break;
      case 'ChangeRequest':
        itemData = await getChangeRequest(review.itemReviewed).unwrap();
        navigate(`/change-requests/${review.itemReviewed}`, { state: { itemData } });
        break;
      default:
        console.log("Unsupported item type for review");
    }
  };

  const handleApproval = async (isApproved) => {
    const decision = isApproved ? 'Approved' : 'Rejected';
    const feedback = document.getElementById('feedback').value; 
    const reviewerId = task.assignedTo[0]._id;
    console.log(task.assignedTo)

    try {
      await submitReview({
        id: reviewId,
        reviewerId, 
        decision,
        feedback
      }).unwrap();
      console.log('Review submitted successfully:', decision);
      navigate(`/review-success`);
    } catch (error) {
      console.error('Failed to submit review:', error);
    }
  };

  if (isLoadingReview) return <p>Loading review details...</p>;
  if (isErrorReview) return <p>Error loading review details: {errorReview?.data?.message}</p>;
  if (isErrorSubmission) return <p>Error submitting review: {errorSubmission?.data?.message}</p>;

  return (
    <div className="container mt-3">
      <h2>Review Details</h2>
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">{task?.name}</h5>
          <h6 className="card-subtitle mb-2 text-muted">Request ID: {review?._id}</h6>
          <p className="card-text"><strong>Item ID:</strong> <a onClick={handleViewItemClick} style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}>{review?.itemReviewed}</a></p>
          <p className="card-text"><strong>Description:</strong> {task?.description}</p>
          <p className="card-text"><strong>Due By:</strong> {new Date(task?.dueDate).toLocaleDateString()}</p>
          <div className="mb-3">
            <label htmlFor="feedback" className="form-label">Your Feedback</label>
            <textarea id="feedback" className="form-control" rows="3" placeholder="Enter your feedback here..."></textarea>
          </div>
          <div className="d-flex justify-content-between">
            <button className="btn btn-success" onClick={() => handleApproval(true)}>Approve</button>
            <button className="btn btn-danger" onClick={() => handleApproval(false)}>Reject</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewTab;