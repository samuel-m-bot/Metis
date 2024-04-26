import { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import { useGetProjectReviewersQuery } from '../features/projects/projectsApiSlice';
import { useAddNewReviewMutation } from '../features/reviews/reviewsApiSlice';
import { useManageReviewTasksMutation } from '../features/Tasks/tasksApiSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';

const ReviewerSelectionModal = ({ show, handleClose, task, changeRequestData, isChangeRequest = false }) => {
  const projectId = changeRequestData?.projectId || task?.projectId._id;
  const { data: reviewers, isLoading, isError, error } = useGetProjectReviewersQuery(projectId);
  const [addNewReview, { isLoading: isLoadingR }] = useAddNewReviewMutation();
  const [manageReviewTasks, { isLoading: isLoadingManageTasks }] = useManageReviewTasksMutation();
  const [selectedUsers, setSelectedUsers] = useState([]);

  const handleCheckboxChange = (userId) => {
    setSelectedUsers(prev => prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]);
  };

  const handleSubmit = async () => {
    const reviewers = selectedUsers.map(userId => ({ userId, decision: 'Pending', feedback: '' }));
    const getItemReviewedId = () => task?.relatedTo === 'Document' ? task.assignedDocument : task?.relatedTo === 'Design' ? task.assignedDesign : task?.relatedTo === 'Product' ? task.assignedProduct : null;

    const reviewData = {
      itemReviewed: isChangeRequest ? changeRequestData._id : getItemReviewedId(),
      onModel: isChangeRequest ? 'ChangeRequest' : task?.relatedTo,
      reviewers,
      ...(task?.assignedChangeRequest && { reviewType: 'Update' })
    };

    try {
      const newReview = await addNewReview(reviewData).unwrap();
      console.log('Review created:', newReview);

      const taskData = {
        projectId,
        reviewId: newReview._id,
        reviewers,
        taskDetails: {
          id: isChangeRequest ? undefined : task?.id,
          relatedTo: isChangeRequest ? 'ChangeRequest' : task?.relatedTo,
          priority: changeRequestData?.priority || task?.priority,
          dueDate: changeRequestData?.estimatedCompletionDate || task?.dueDate,
          assignedTo: changeRequestData?.assignedTo || task?.assignedTo,
          assignedDesign: task?.assignedDesign,
          assignedDocument: task?.assignedDocument,
          assignedProduct: task?.assignedProduct,
        },
        isChangeRequest
      };

      if(isChangeRequest) taskData.taskDetails.assignedChangeRequest = changeRequestData?._id
      else if(task?.assignedChangeRequest) taskData.taskDetails.assignedChangeRequest = task?.assignedChangeRequest

      await manageReviewTasks(taskData).unwrap();
      handleClose(); // Close the modal on successful creation
    } catch (error) {
      console.error('Error creating review and managing tasks:', error);
    }
  };

  if (isLoading || isLoadingR || isLoadingManageTasks) return <p>Loading...</p>;
  if (isError) return <p>Error loading reviewers: {error?.data?.message}</p>;

  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Select Reviewers</Modal.Title>
      </Modal.Header>
      <Modal.Body>
            <div className="list-group">
                {reviewers.map(user => (
                    <label key={user._id} className="list-group-item d-flex align-items-center">
                        <input
                            type="checkbox"
                            className="form-check-input me-2"
                            checked={selectedUsers.includes(user._id)}
                            onChange={() => handleCheckboxChange(user._id)}
                            style={{ cursor: 'pointer' }}
                        />
                        <FontAwesomeIcon icon={faUserCircle} className="me-2" size="lg" />
                        <div>
                            <strong>{user.firstName} {user.surname}</strong> <br />
                            <small className="text-muted">{user.email}</small>
                        </div>
                    </label>
                ))}
            </div>
        </Modal.Body>
      <Modal.Footer>
        <button className="btn btn-secondary" onClick={handleClose}>Cancel</button>
        <button className="btn btn-primary" onClick={handleSubmit}>Confirm Reviewers</button>
      </Modal.Footer>
    </Modal>
  );
};

export default ReviewerSelectionModal;