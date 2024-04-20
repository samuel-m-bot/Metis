import { useNavigate } from 'react-router-dom';
import { useGetChangeRequestsByRelatedItemQuery } from '../features/changes/changeRequestsApiSlice';

const ChangeRequestsTable = ({ type, itemId }) => {
  const navigate = useNavigate();
  const {
    data: changeRequests,
    isLoading,
    isError,
    error
  } = useGetChangeRequestsByRelatedItemQuery({ type, itemId });

  const handleViewChangeRequest = (changeRequestID) => {
    navigate(`/change-requests/${changeRequestID}`);
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {error?.data?.message}</div>;

  return (
    <>
    <div className="changes-summary">
            <h3>Summary of Changes</h3>
            <p>Total Change Requests: <strong>{10}</strong></p>
            <p>Approved: <strong>4</strong></p>
            <p>Pending Approval (Requested): <strong>3</strong></p>
            <p>Rejected: <strong>2</strong></p>
            <p>Reviewed: <strong>1</strong></p>
      </div>
      <h3>Change Request Table</h3>
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Requested By</th>
            <th>Date Requested</th>
            <th>Status</th>
            <th>Impact Level</th>
            <th>Approval Date</th>
          </tr>
        </thead>
        <tbody>
          {changeRequests?.map((cr) => (
            <tr key={cr.id}>
              <td>
                <a href="#" onClick={(e) => { e.preventDefault(); handleViewChangeRequest(cr.id); }}>{cr.id}</a>
              </td>
              <td>{cr.title}</td>
              <td>{cr.requestedBy}</td>
              <td>{new Date(cr.dateRequested).toLocaleDateString()}</td>
              <td>{cr.status}</td>
              <td>{cr.impactLevel}</td>
              <td>{cr.approvalDate ? new Date(cr.approvalDate).toLocaleDateString() : 'N/A'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default ChangeRequestsTable;
