import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetChangeRequestsByProjectAndStatusQuery } from './changeRequestsApiSlice';

const ChangeRequestsTable = ({ projectId, status }) => {
  const navigate = useNavigate();
  const {
    data: changeRequests,
    isLoading,
    isError,
    error
  } = useGetChangeRequestsByProjectAndStatusQuery({ projectId, status });

  const handleViewChangeRequest = (changeRequestID) => {
    navigate(`/change-requests/${changeRequestID}`);
  };

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error: {error?.data?.message}</p>;
  if (!changeRequests || changeRequests.length === 0) return <p>No change requests found.</p>;

  return (
    <table className="table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Requested By</th>
          <th>Description</th>
          <th>Status</th>
          <th>Priority</th>
          <th>Date Issued</th>
          <th>Assigned To</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {console.log(changeRequests)}
        {changeRequests.map((request) => {
          return (
            <tr key={request.id}>
              <td>
                <a href="#" onClick={(e) => {
                  e.preventDefault();
                  handleViewChangeRequest(request.id);
                }}>{request.id}</a>
              </td>
              <td>{request.requestedBy.firstName} {request.requestedBy.surname}</td>
              <td>{request.description}</td>
              <td>{request.status}</td>
              <td>{request.priority}</td>
              <td>{new Date(request.creationDate).toLocaleDateString()}</td>
              <td>{request.assignedTo ? `${request.assignedTo.firstName} ${request.assignedTo.surname}` : 'Unassigned'}</td>
              <td>
                <button onClick={() => handleViewChangeRequest(request.id)} className="btn btn-primary">View</button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default ChangeRequestsTable;