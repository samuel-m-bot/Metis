import React, { useState } from 'react';
import { Tab, Tabs } from 'react-bootstrap';
import { useParams } from 'react-router-dom'; 
import './Tasks.css'

const TaskDetails = () => {
  const [key, setKey] = useState('details');

  const taskType = "Update"; // "Review", "Approve", or "Update"

  const handleApproval = (isApproved) => {
    if (isApproved) {
      console.log("Change request approved");
    } else {
      console.log("Change request rejected");
    }
  };

  const handleSubmitUpdate = (e) => {
    e.preventDefault();
    const updateDetails = document.getElementById('updateDetails').value;
    const reasonForUpdate = document.getElementById('reasonForUpdate').value;
  
    console.log("Submitting update with details:", updateDetails, "and reason:", reasonForUpdate);

  };
  
  return (
    <div className="tasks-container">
      <h2>Task Details</h2>
      <Tabs
        id="task-tabs"
        activeKey={key}
        onSelect={(k) => setKey(k)}
        className="mb-3"
      >
        <Tab eventKey="details" title="Details">
            <div className="task-details">
                <h3>Task Information</h3>
                <div className="mb-3">
                <strong>Task ID:</strong> <span>#12345</span>
                </div>
                <div className="mb-3">
                <strong>Title:</strong> <span>Review Design Document</span>
                </div>
                <div className="mb-3">
                <strong>Description:</strong>
                <p>
                    Review the latest version of the design document and provide feedback
                    on sections 4.2 and 5.1 regarding user interface and experience.
                </p>
                </div>
                <div className="mb-3">
                <strong>Assigned To:</strong> <span>Jane Doe</span>
                </div>
                <div className="mb-3">
                <strong>Status:</strong> <span>Pending Review</span>
                </div>
                <div className="mb-3">
                <strong>Creation Date:</strong> <span>2023-01-15</span>
                </div>
                <div className="mb-3">
                <strong>Due Date:</strong> <span>2023-01-22</span>
                </div>
                {/* Additional details as needed */}
            </div>
        </Tab>


        {taskType === "Approve" && (
        <Tab eventKey="approve" title="Approve Request">
            <div className="approve-request">
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


        {taskType === "Update" && (
        <Tab eventKey="update" title="Update Item">
            <div className="update-item">
                <h3>Item Update</h3>
                <div className="item-info">
                    <p><strong>Item ID:</strong> <a href={`/item-path/${"ITEM123"}`} target="_blank" rel="noopener noreferrer">ITEM123</a></p>
                    <p><strong>Item Name:</strong> Project Specification Document</p>
                    <p><strong>Current Version:</strong> 1.2</p>
                </div>
                <div className="update-steps">
                    <h4>Steps to Update:</h4>
                    <ol>
                        <li>Click the link to navigate to the item.</li>
                        <li>Once on the item page, click on the actions dropdown.</li>
                        <li>Select "Check Out" item.</li>
                        <li>Download and update the item as needed.</li>
                        <li>Check the item back in with the updated version.</li>
                        <li>Return to this task to write any comments and confirm the update for review.</li>
                    </ol>
                </div>
                <form className="update-form" onSubmit={handleSubmitUpdate}>
                    <div className="form-group">
                    <label htmlFor="updateDetails">Update Details</label>
                    <textarea id="updateDetails" rows="4" className="form-control" placeholder="Describe the updates being made..."></textarea>
                    </div>
                    <div className="form-group">
                    <label htmlFor="reasonForUpdate">Reason for Update</label>
                    <input type="text" id="reasonForUpdate" className="form-control" placeholder="Enter the reason for the update"></input>
                    </div>
                    <button type="submit" className="btn btn-primary mt-3">Submit Update</button>
                </form>
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
