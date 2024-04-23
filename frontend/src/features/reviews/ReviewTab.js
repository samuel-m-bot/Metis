import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetReviewByIdQuery, useReviewSubmissionMutation } from './reviewsApiSlice';
import { useLazyGetDocumentByIdQuery } from '../documents/documentsApiSlice';
import { useLazyGetDesignByIdQuery } from '../designs/designsApiSlice';
import { useLazyGetProductByIdQuery } from '../products/productsApiSlice';

const ReviewTab = ({ task }) => {
  const navigate = useNavigate();
  const reviewId = task.review;
  const { data: review, isLoading: isLoadingReview, isError: isErrorReview, error: errorReview } = useGetReviewByIdQuery(reviewId);
  const [submitReview, { isError: isErrorSubmission, error: errorSubmission }] = useReviewSubmissionMutation();

  // Lazy queries to fetch item details
  const [getDocument] = useLazyGetDocumentByIdQuery();
  const [getDesign] = useLazyGetDesignByIdQuery();
  const [getProduct] = useLazyGetProductByIdQuery();

  const handleViewItemClick = async () => {
    let documentData, designData, productData;
    switch (review?.onModel) {
      case 'Document':
        documentData = await getDocument(review.itemReviewed).unwrap();
        navigate(`/documents/${review.itemReviewed}`, { state: { documentData } });
        break;
      case 'Design':
        designData = await getDesign(review.itemReviewed).unwrap();
        navigate(`/designs/${review.itemReviewed}`, { state: { designData } });
        break;
      case 'Product':
        productData = await getProduct(review.itemReviewed).unwrap();
        navigate(`/products/${review.itemReviewed}`, { state: { productData } });
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
    <div className="review-request">
      <h3>Review Details</h3>
      <div className="request-summary">
        <p><strong>Request ID:</strong> {review?._id}</p>
        <p><strong>Title:</strong> {task?.name}</p>
        <p><strong>Item ID:</strong> <a onClick={handleViewItemClick} style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}>{review?.itemReviewed}</a></p>
        <p><strong>Description:</strong> {task?.description}</p>
        <p><strong>Due By:</strong> {new Date(task?.dueDate).toLocaleDateString()}</p>
      </div>
      <div className="review-feedback">
        <label htmlFor="feedback">Your Feedback</label>
        <textarea id="feedback" rows="3" placeholder="Enter your feedback here..."></textarea>
      </div>
      <div className="approval-controls">
        <button className="btn btn-success" onClick={() => handleApproval(true)}>Approve</button>
        <button className="btn btn-danger" onClick={() => handleApproval(false)}>Reject</button>
      </div>
    </div>
  );
};

export default ReviewTab;