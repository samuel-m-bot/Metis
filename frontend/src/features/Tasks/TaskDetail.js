import React from 'react';
import { Tab, Tabs } from 'react-bootstrap';
import { useParams } from 'react-router-dom'; 
import './Tasks.css';
import CreationModal from '../../components/CreationModal';
import { useGetTaskByIdQuery } from './tasksApiSlice';
import ReviewerSelectionModal from '../../components/ReviewerSelectionModal';
import ReviewTab from '../reviews/ReviewTab';
import ObserveTab from '../reviews/ObserveTab';
import UpdateTaskTab from '../../components/UpdateTaskTab';
import ReviseTaskTab from './ReviseTaskTab';
import CreateTaskTab from './CreateTaskTab';
import OnModelActivity from '../activity/OnModelActivity';

const TaskDetails = () => {
  const { taskId } = useParams();
  const { data: task, isLoading, isError, error } = useGetTaskByIdQuery(taskId);

  const [key, setKey] = React.useState('details');
  const [showModal, setShowModal] = React.useState(false);

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const handleApproval = (isApproved) => {
    console.log(isApproved ? "Change request approved" : "Change request rejected");
  };

  const handleSubmitUpdate = (e) => {
    e.preventDefault();
    console.log("Update submitted");
  };
  const renderItemDetails = () => {
    const itemId = task.assignedDocument || task.assignedDesign || task.assignedProduct;
    
    switch (task.relatedTo) {
      case 'Document':
        return (
          <div className="item-details">
            <p><strong>Document ID:</strong> {itemId}</p>
            <p><strong>Title:</strong> {task.name}</p>
            <p><strong>Description:</strong> {task.description}</p>
          </div>
        );
      case 'Design':
        return (
          <div className="item-details">
            <p><strong>Design ID:</strong> {itemId}</p>
            <p><strong>Title:</strong> {task.name}</p>
            <p><strong>Description:</strong> {task.description}</p>
          </div>
        );
      case 'Product':
        return (
          <div className="item-details">
            <p><strong>Product ID:</strong> {itemId}</p>
            <p><strong>Title:</strong> {task.name}</p>
            <p><strong>Description:</strong> {task.description}</p>
          </div>
        );
      default:
        return <p>Item type not recognized.</p>;
    }
  };
  
  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error: {error?.data?.message}</p>;
  return (
    <div className="tasks-container">
      <h2>Task Details</h2>
      <Tabs id="task-tabs" activeKey={key} onSelect={(k) => setKey(k)} className="mb-3">
        <Tab eventKey="details" title="Details">
            <div className="task-details mt-3">
                <div className="card">
                    <div className="card-header">
                        Task Information
                    </div>
                    <div className="card-body">
                        <h5 className="card-title">Name: {task.name}</h5>
                        <p className="card-text">{task.description}</p>
                        <ul className="list-group list-group-flush">
                            <li className="list-group-item"><strong>Task ID:</strong> {task._id}</li>
                            <li className="list-group-item"><strong>Assigned To:</strong> {task.assignedTo.map(user => `${user.firstName} ${user.surname}`).join(", ")}</li>
                            <li className="list-group-item"><strong>Status:</strong> {task.status}</li>
                            <li className="list-group-item"><strong>Creation Date:</strong> {new Date(task.creationDate).toLocaleDateString()}</li>
                            <li className="list-group-item"><strong>Due Date:</strong> {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'N/A'}</li>
                        </ul>
                    </div>
                </div>
            </div>
        </Tab>

        {task.taskType === "Review" && task.status !== 'Completed' && (
        <Tab eventKey="review" title="Review Request">
          <ReviewTab task={task} />
        </Tab>
        )}

        {task.taskType === "Update" && task.status !== 'Completed' && (
          <Tab eventKey="update" title="Update Task">
            <UpdateTaskTab task={task} />
          </Tab>
        )}

        {task.taskType === "Revise" && task.status !== 'Completed' && (
            <Tab eventKey="revise" title="Revise Task">
                <ReviseTaskTab task={task} />
            </Tab>
        )}

        {task.taskType === "Observe" && (
          <Tab eventKey="Observe" title="Observe Request">
            <ObserveTab task={task} />
          </Tab>
        )}

        {task.taskType === "Create" && task.status !== 'Completed' && (
            <Tab eventKey="create" title="Create Item">
                <CreateTaskTab 
                    task={task} 
                    handleOpenModal={handleOpenModal} 
                    handleCloseModal={handleCloseModal} 
                    showModal={showModal} 
                />
            </Tab>
        )}



        {task.taskType === "Set up Review" &&  task.status !== 'Completed' && (
          <Tab eventKey="set-up-review" title="Set up Review">
            <div className="set-up-review">
              <h3>Set up Document Review</h3>
              <p>To set up the review for this document, please follow the instructions below:</p>
              <ol>
                <li>Review the document details provided below.</li>
                <li>Click on 'Select Reviewers' to choose the individuals responsible for the review.</li>
                <li>Confirm the selection to initiate the review process.</li>
              </ol>
              {console.log(task)}
              {renderItemDetails()}
              <button className="btn btn-primary" onClick={handleOpenModal}>Select Reviewers</button>
              <ReviewerSelectionModal show={showModal} handleClose={handleCloseModal} task={task} />
            </div>
          </Tab>
        )}

        <Tab eventKey="history" title="History">
          <OnModelActivity relatedTo={task.id} onModel={'Task'} />
        </Tab>
      </Tabs>
    </div>
  );
};

export default TaskDetails;
