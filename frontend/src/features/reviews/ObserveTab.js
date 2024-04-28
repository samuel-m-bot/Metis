import { useGetReviewByIdQuery } from './reviewsApiSlice'; 

const ObserveTab = ({ task }) => {
  const { data: review, isLoading, isError, error } = useGetReviewByIdQuery(task.review);

  if (isLoading) return <div>Loading review details...</div>;
  if (isError) return <div>Error loading review: {error.message}</div>;

  return (
    <div className="container mt-3">
      <h2>Review Observation</h2>
      <div className="card mb-3">
        <div className="card-header">
          Review Details
        </div>
        <ul className="list-group list-group-flush">
          <li className="list-group-item"><strong>Review ID:</strong> {review._id}</li>
          <li className="list-group-item"><strong>Item Reviewed:</strong> {review.itemReviewed}</li>
          <li className="list-group-item"><strong>Status:</strong> {review.status}</li>
          <li className="list-group-item"><strong>Initiation Date:</strong> {new Date(review.initiationDate).toLocaleDateString()}</li>
        </ul>
      </div>
      <div className="card">
        <div className="card-header">
          Reviewer Feedback
        </div>
        {console.log(task)}
        {review.reviewers.map(reviewer => (
          <div key={reviewer._id} className="card mb-2">
            <div className="card-body">
              <h5 className="card-title">{reviewer.userId.firstName} {reviewer.userId.surname}</h5>
              <h6 className="card-subtitle mb-2 text-muted">
                Decision: 
                <strong className={`badge ${reviewer.decision === 'Approved' ? 'bg-success' : reviewer.decision === 'Rejected' ? 'bg-danger' : 'bg-warning'}`}>
                  {reviewer.decision}
                </strong>
              </h6>
              <p className="card-text">
                <strong>Feedback:</strong> {reviewer.feedback || "No feedback provided"}
              </p>
              <p className="card-text">
                <small className="text-muted">Reviewed on: {new Date(reviewer.reviewDate).toLocaleDateString()}</small>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ObserveTab;
