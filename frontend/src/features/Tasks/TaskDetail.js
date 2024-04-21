import React from 'react';
import { Tab, Tabs } from 'react-bootstrap';
import { useParams } from 'react-router-dom'; 
import './Tasks.css';
import CreationModal from '../../components/CreationModal';
import { useGetTaskByIdQuery } from './tasksApiSlice';

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

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error: {error?.data?.message}</p>;
  return (
    <div className="tasks-container">
      <h2>Task Details</h2>
      <Tabs id="task-tabs" activeKey={key} onSelect={(k) => setKey(k)} className="mb-3">
        <Tab eventKey="details" title="Details">
          <div className="task-details">
            <h3>Task Information</h3>
            <div><strong>Task ID:</strong> <span>{task._id}</span></div>
            <div><strong>Title:</strong> <span>{task.name}</span></div>
            <div><strong>Description:</strong> <p>{task.description}</p></div>
            <div><strong>Assigned To:</strong> <span>{task.assignedTo.map(user => user.firstName).join(", ")}</span></div>
            <div><strong>Status:</strong> <span>{task.status}</span></div>
            <div><strong>Creation Date:</strong> <span>{new Date(task.creationDate).toLocaleDateString()}</span></div>
            <div><strong>Due Date:</strong> <span>{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'N/A'}</span></div>
          </div>
        </Tab>

        {task.taskType === "Review" && (
        <Tab eventKey="review" title="Review Request">
          <div className="review-request">
            <h3>Change Request Review</h3>
            <div className="request-summary">
              <p><strong>Request ID:</strong> CR123</p>
              <p><strong>Title:</strong> Update Project Specification</p>
              <p><strong>Description:</strong> This change request involves updating the project specification documents to include new requirements for the security module.</p>
              <p><strong>Submitted By:</strong> Jane Doe</p>
              <p><strong>Submission Date:</strong> 2023-03-15</p>
            </div>
            <div className="review-comments">
              <label htmlFor="comments">Your Comments</label>
              <textarea id="comments" rows="3" placeholder="Enter your comments or feedback here..."></textarea>
            </div>
            <div className="approval-controls">
              <button className="btn btn-success" onClick={() => handleApproval(true)}>Approve</button>
              <button className="btn btn-danger" onClick={() => handleApproval(false)}>Reject</button>
            </div>
          </div>
        </Tab>
        )}

        {task.taskType === "Create" && (
          <Tab eventKey="create" title="Create Item">
            <div className="create-item">
              <h3>Create New Item</h3>
              <p>To create a new item, please follow the instructions below:</p>
              <ol>
                <li>Click on 'Create Item' to open the creation form.</li>
                <li>Fill out the form with the necessary details.</li>
                <li>Submit the form to finalize the creation of the new item.</li>
              </ol>
              <button className="btn btn-primary" onClick={handleOpenModal}>Create Item</button>
              {console.log(task)}
              <CreationModal show={showModal} taskType={task.relatedTo} closeModal={handleCloseModal} projectId={task.projectId._id} task={task}/>
            </div>
          </Tab>
        )}
        
        <Tab eventKey="history" title="History">
          <div className="task-history">
              <h3>Task History</h3>
              <table className="table">
              <thead>
                  <tr>
                  <th>Date</th>
                  <th>Event</th>
                  <th>User</th>
                  </tr>
              </thead>
              <tbody>
                  <tr>
                  <td>2023-01-16</td>
                  <td>Task Created</td>
                  <td>Admin</td>
                  </tr>
                  <tr>
                  <td>2023-01-17</td>
                  <td>Assigned to Jane Doe</td>
                  <td>Admin</td>
                  </tr>
                  <tr>
                  <td>2023-01-20</td>
                  <td>Comment added: "Starting review."</td>
                  <td>Jane Doe</td>
                  </tr>
                  <tr>
                  <td>2023-01-22</td>
                  <td>Status Updated: Completed</td>
                  <td>Jane Doe</td>
                  </tr>
              </tbody>
              </table>
          </div>
        </Tab>
      </Tabs>
    </div>
  );
};

export default TaskDetails;
