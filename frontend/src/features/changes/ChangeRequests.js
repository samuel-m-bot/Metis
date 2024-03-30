import React, { useState } from 'react';
import { Button, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const initialChangeRequests = [
  { id: 'CR001', title: 'Update Project Scope', status: 'Pending', dateIssued: '2023-01-10' },
  { id: 'CR002', title: 'Revise Budget Allocation', status: 'Approved', dateIssued: '2023-02-05' },
];

const ChangeRequests = () => {
  const [changeRequests, setChangeRequests] = useState(initialChangeRequests);

  return (
    <div className="container mt-4">
      <h2>Change Requests</h2>
      <Table striped bordered hover responsive className="mt-3">
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Status</th>
            <th>Date Issued</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {changeRequests.map((request) => (
            <tr key={request.id}>
              <td>
                <Link to={`/change-requests/${request.id}`}>{request.id}</Link>
              </td>
              <td>{request.title}</td>
              <td>{request.status}</td>
              <td>{request.dateIssued}</td>
              <td>
                <Link to={`/change-requests/${request.id}`} className="btn btn-info btn-sm me-2">View</Link>
                <Button variant="primary" size="sm" className="me-2">Edit</Button>
                <Button variant="danger" size="sm">Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default ChangeRequests;
