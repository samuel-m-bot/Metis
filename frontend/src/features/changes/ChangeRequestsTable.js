import React from 'react';
import { useNavigate } from 'react-router-dom';

const ChangeRequestsTable = ({ changeRequests }) => {
  const navigate = useNavigate();

  const handleViewChangeRequest = (changeRequestID) => {
    navigate(`/change-requests/${changeRequestID}`);
  };

  return (
    <table className="table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Title</th>
          <th>Description</th>
          <th>Status</th>
          <th>Date Issued</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {changeRequests.map((request) => (
          <tr key={request.id}>
            <td>
              <a href="#" onClick={() => handleViewChangeRequest(request.id)}>{request.id}</a>
            </td>
            <td>{request.title}</td>
            <td>{request.description}</td>
            <td>{request.status}</td>
            <td>{new Date(request.dateIssued).toLocaleDateString()}</td>
            <td>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ChangeRequestsTable;
