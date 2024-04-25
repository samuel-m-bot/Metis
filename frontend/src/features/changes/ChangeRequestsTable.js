import { useEffect } from 'react';
import { useNavigate, usee } from 'react-router-dom';
import { useLazyGetChangeRequestsByMainItemQuery } from './changeRequestsApiSlice';

const ChangeRequestsTable = ({ mainItemId }) => {
  console.log("HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH")
  const navigate = useNavigate();
  const [triggerQuery, { data: changeRequests, isLoading, isError, error }] = useLazyGetChangeRequestsByMainItemQuery();

  useEffect(() => {
    if (mainItemId) {
      console.log(mainItemId)
      triggerQuery(mainItemId);
      console.log("Triegered")
    }
  }, [mainItemId, triggerQuery]);

  const handleViewChangeRequest = (changeRequestID) => {
    const itemData = changeRequests.find(request => request._id === changeRequestID);
  
    if (itemData) {
      navigate(`/change-requests/${changeRequestID}`, { state: { itemData } });
    } else {
      console.error("No change request found with ID:", changeRequestID);
    }
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
        {changeRequests.map((request) => (
          <tr key={request._id}>
            <td>
              <a href="#" onClick={(e) => {
                e.preventDefault();
                handleViewChangeRequest(request._id);
              }}>{request._id}</a>
            </td>
            <td>{request.requestedBy.firstName} {request.requestedBy.surname}</td>
            <td>{request.description}</td>
            <td>{request.status}</td>
            <td>{request.priority}</td>
            <td>{new Date(request.creationDate).toLocaleDateString()}</td>
            <td>{request.assignedTo ? `${request.assignedTo.firstName} ${request.assignedTo.surname}` : 'Unassigned'}</td>
            <td>
              <button onClick={() => handleViewChangeRequest(request._id)} className="btn btn-primary">View</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ChangeRequestsTable;
