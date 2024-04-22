import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetReviewByIdQuery } from './reviewsApiSlice';
// Import your lazy hooks for fetching item details
import { useLazyGetDocumentByIdQuery } from '../documents/documentsApiSlice';
import { useLazyGetDesignByIdQuery } from '../designs/designsApiSlice';
import { useLazyGetProductByIdQuery } from '../products/productsApiSlice';

const ReviewTab = ({ task }) => {
  const navigate = useNavigate();
  const reviewId = task.review;
  const { data: review, isLoading, isError, error } = useGetReviewByIdQuery(task.review);

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

  if (isLoading) return <p>Loading review details...</p>;
  if (isError) return <p>Error loading review details: {error?.data?.message}</p>;

  return (
    <div className="review-request">
      <h3>Review Details</h3>
      <div className="request-summary">
        <p><strong>Request ID:</strong> {review?._id}</p>
        <p><strong>Title:</strong> {task?.name}</p>
        <p><strong>Item ID:</strong> <a href="#" onClick={handleViewItemClick}>{review?.itemReviewed}</a></p>
        <p><strong>Description:</strong> {task?.description}</p>
        <p><strong>Due By:</strong> {new Date(task?.dueDate).toLocaleDateString()}</p>
        <ol>
          <li>Click on the item id to navigate to the page for that item.</li>
          <li>Download the item to review.</li>
          <li>Input feedback and either approve or reject the review.</li>
        </ol>
      </div>
      <div className="review-feedback">
        <label htmlFor="feedback">Your Feedback</label>
        <textarea id="feedback" rows="3" placeholder="Enter your feedback or feedback here..."></textarea>
      </div>
      <div className="approval-controls">
        {/* <button className="btn btn-success" onClick={() => handleApproval(true)}>Approve</button>
        <button className="btn btn-danger" onClick={() => handleApproval(false)}>Reject</button> */}
      </div>
    </div>
  );
};

export default ReviewTab;