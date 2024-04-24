import { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import { useGetProjectReviewersQuery } from '../features/projects/projectsApiSlice';
import { useAddNewReviewMutation } from '../features/reviews/reviewsApiSlice';
import { useManageReviewTasksMutation } from '../features/Tasks/tasksApiSlice'; // Import the mutation

const ReviewerSelectionModal = ({ show, handleClose, task, changeRequestData, isChangeRequest = false }) => {
  const { data: reviewers, isLoading, isError, error } = useGetProjectReviewersQuery(changeRequestData?.projectId || task?.projectId);
  const [addNewReview , {isLoading: isLoadingR}]  = useAddNewReviewMutation();
  const [manageReviewTasks, { isLoading: isLoadingManageTasks }] = useManageReviewTasksMutation();
  const [selectedUsers, setSelectedUsers] = useState([]);

  const handleCheckboxChange = (userId) => {
    setSelectedUsers(prev => {
      if (prev.includes(userId)) {
        return prev.filter(id => id !== userId);
      } else {
        return [...prev, userId];
      }
    });
  };

  const handleSubmit = async () => {
    console.log('Selected reviewers:', selectedUsers);

    const reviewers = selectedUsers.map(userId => ({
      userId,
      decision: 'Pending',
      feedback: ''
    }));

    // Determine which item ID to use based on what the task is related to
    const getItemReviewedId = () => {
        switch (task.relatedTo) {
          case 'Document':
            return task.assignedDocument;
          case 'Design':
            return task.assignedDesign;
          case 'Product':
            return task.assignedProduct;
          default:
            return null;
        }
      }
  
    const reviewData = {
      itemReviewed: isChangeRequest ? changeRequestData._id : getItemReviewedId(),
      onModel: isChangeRequest ? 'ChangeRequest' : task.relatedTo,
      reviewers,
    };

    try {
      const newReview = await addNewReview(reviewData).unwrap();
      console.log('Review created:', newReview);

      const taskData = {
        projectId: changeRequestData?.projectId || task.projectId,
        reviewId: newReview._id,
        reviewers,
        taskDetails: {
          id: isChangeRequest ? undefined : task.id,
          relatedTo: isChangeRequest ? 'ChangeRequest' : task.relatedTo,
          priority: changeRequestData?.priority || task.priority,
          dueDate: changeRequestData?.estimatedCompletionDate || task.dueDate,
          assignedTo: changeRequestData?.assignedTo || task.assignedTo,
        },
        isChangeRequest
      };

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
        {reviewers && reviewers.map(user => (
          <div key={user._id}>
            <input
              type="checkbox"
              checked={selectedUsers.includes(user._id)}
              onChange={() => handleCheckboxChange(user._id)}
            /> {user.firstName} {user.surname} -- {user.email}
          </div>
        ))}
      </Modal.Body>
      <Modal.Footer>
        <button className="btn btn-secondary" onClick={handleClose}>Cancel</button>
        <button className="btn btn-primary" onClick={handleSubmit}>Confirm Reviewers</button>
      </Modal.Footer>
    </Modal>
  );
};

export default ReviewerSelectionModal;