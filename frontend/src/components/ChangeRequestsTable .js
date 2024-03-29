import React from 'react';
import { useNavigate } from 'react-router-dom';

const ChangeRequestsTable = () => {
  const navigate = useNavigate()
  const changeRequests = [
    {
      id: 'CR001',
      title: 'Update document format',
      requestedBy: 'Alice Johnson',
      dateRequested: '2022-09-01',
      status: 'Pending',
      impactLevel: 'Medium',
      approvalDate: null,
    },
    {
      id: 'CR002',
      title: 'Add new compliance section',
      requestedBy: 'Bob Smith',
      dateRequested: '2022-09-15',
      status: 'Approved',
      impactLevel: 'High',
      approvalDate: '2022-09-20',
    },
    {
      id: 'CR003',
      title: 'Revise safety protocols',
      requestedBy: 'Carol Danvers',
      dateRequested: '2022-10-05',
      status: 'Rejected',
      impactLevel: 'Low',
      approvalDate: '2022-10-10',
    },
  ];

  const handleViewChangeRequest = (changeRequestID) => {
    navigate(`/change-requests/${changeRequestID}`);
  };

  return (
    <>
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
        {changeRequests.map((cr) => (
          <tr key={cr.id}>
            <td>
              <a href="#" onClick={() => handleViewChangeRequest(cr.id)}>{cr.id}</a>
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
