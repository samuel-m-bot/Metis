import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import { useGetProjectReviewersQuery } from '../features/projects/projectsApiSlice';
import { useAddNewReviewMutation } from '../features/reviews/reviewsApiSlice';
import { useUpdateTaskMutation, useAddNewTaskMutation } from '../features/Tasks/tasksApiSlice';

const ReviewerSelectionModal = ({ show, handleClose, task }) => {
  const projectId = task.projectId;  
  const { data: reviewers, isLoading, isError, error } = useGetProjectReviewersQuery(projectId._id);
  const [addNewReview , {isLoadingR}]  = useAddNewReviewMutation();
  const [updateTask, { isLoadingUpdateTask }] = useUpdateTaskMutation();
  const [addNewTask, { isLoadingAddTask }] = useAddNewTaskMutation();
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
    };
  
    const reviewData = {
      itemReviewed: getItemReviewedId(),
      onModel: task.relatedTo,
      reviewers
    };
  
    try {
      const newReview = await addNewReview(reviewData).unwrap();
      console.log('Review created:', newReview);
  
      // Complete the "Set Up Review" task
      const updatedTaskData = {
        id: task.id,
        status: 'Completed'
      };
      await updateTask(updatedTaskData).unwrap();
  
      // Create individual review tasks for each reviewer
      for (const reviewer of reviewers) {
        const taskData = {
          projectId: task.projectId._id,
          name: 'Review Task for ' + task.relatedTo,
          description: 'Please review the ' + task.relatedTo.toLowerCase(),
          status: 'Not Started',
          priority: task.priority,
          assignedTo: [reviewer.userId],
          taskType: 'Review',
          relatedTo: task.relatedTo,
          dueDate: task.dueDate,
          assignedDocument: task.assignedDocument,
          assignedDesign: task.assignedDesign,
          assignedProduct: task.assignedProduct,
          review: newReview._id
        };
  
        await addNewTask(taskData).unwrap();
      }
  
      // Give the user who set up the review an observe task
      const observeTaskData = {
        projectId: task.projectId._id,
        name: 'Observe item review',
        description: 'To watch over the review of the item and follow up on reviews',
        status: 'In Progress',
        priority: task.priority,
        assignedTo: task.assignedTo,
        taskType: 'Observe',
        relatedTo: task.relatedTo,
        dueDate: task.dueDate,
        assignedDocument: task.assignedDocument,
        assignedDesign: task.assignedDesign,
        assignedProduct: task.assignedProduct,
        review: newReview._id
      };
      await addNewTask(observeTaskData).unwrap();
  
      handleClose(); // Close the modal on successful creation
    } catch (error) {
      console.error('Error creating review and tasks:', error);
    }
  };
  
  

  if (isLoading) return <p>Loading reviewers...</p>;
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