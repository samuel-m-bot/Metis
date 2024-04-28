import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { useGetReviewByIdQuery } from '../reviews/reviewsApiSlice';
import { useManageRevisedTaskMutation } from './tasksApiSlice';
import { useGetChangeRequestByIdQuery } from '../changes/changeRequestsApiSlice';

const ReviseTaskTab = ({ task }) => {
  const navigate = useNavigate();
  const { data: review, isLoading: reviewLoading, isError: reviewError } = useGetReviewByIdQuery(task.review);
  const { data: changeRequest, isLoading: isCRLoading } = useGetChangeRequestByIdQuery(task?.assignedChangeRequest);

  const [manageRevisedTask, { isLoading, isError, error }] = useManageRevisedTaskMutation();

  const handleCompleteRevision = async () => {
    try {
      await manageRevisedTask({ projectId: task.projectId._id, taskDetails: task }).unwrap();
      alert("Revision completed and review process initiated.");
    } catch (error) {
      alert("Failed to complete the revision: " + error.message);
    }
  };

  const handleNavigateToItem = async (itemId, itemType) => {
    try {
        let path;
        const itemTypeLower = itemType.toLowerCase();

        console.log(itemTypeLower)
        if (itemTypeLower === 'changerequest') {
            path = 'change-requests';
        } else {
            path = `${itemTypeLower}s`;
        }

        navigate(`/${path}/${itemId}`);
    } catch (error) {
        console.error("Failed to navigate:", error);
    }
};

  if (isCRLoading || reviewLoading) return <div>Loading details...</div>;
  if (reviewError) return <div>Error loading review: {reviewError.message}</div>;

  return (
    <div className="container mt-3">
      <h3>Revise Task Details</h3>
      <div className="card mb-3">
        <div className="card-header">Task Information</div>
        <ul className="list-group list-group-flush">
          <li className="list-group-item"><strong>Task ID:</strong> {task._id}</li>
          <li className="list-group-item"><strong>Description:</strong> {task.description}</li>
          <li className="list-group-item"><strong>Due By:</strong> {new Date(task.dueDate).toLocaleDateString()}</li>
          <li className="list-group-item">
            <strong>{task.relatedTo}:</strong>
            <a
              onClick={() => handleNavigateToItem(task[`assigned${task.relatedTo}`], task.relatedTo)}
              style={{ cursor: 'pointer', textDecoration: 'underline' }}
            >
              {task[`assigned${task.relatedTo}`]}
            </a>
          </li>
        </ul>
      </div>


      <div className="card">
        <div className="card-header">Review Feedback and Revision Instructions</div>
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
            </div>
          </div>
        ))}
      </div>

      <div className="instructions card mt-3">
        <div className="card-header">Steps for Revising</div>
        <ul className="list-group list-group-flush">
          <li className="list-group-item">
            Go through the feedback from reviewers and make necessary revisions to the items linked below.
          </li>
          <li className="list-group-item">
            Use the links provided to check out items, make updates, and check them back in.
          </li>
          <li className="list-group-item">
            After updating, revisit this tab to mark the revision as complete.
          </li>
        </ul>
      </div>
      <Button variant="primary" onClick={handleCompleteRevision} disabled={isLoading}>
        Complete Revision
      </Button>
    </div>
  );
};

export default ReviseTaskTab;
