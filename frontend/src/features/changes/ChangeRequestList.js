import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useGetChangeRequestsQuery } from './changeRequestsApiSlice';
import useAuth from '../../hooks/useAuth';

const ChangeRequestList = () => {
  const { data: changeRequests, isLoading, isError, error } = useGetChangeRequestsQuery();
  const [sortedChangeRequests, setSortedChangeRequests] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: 'creationDate', direction: 'ascending' });
  const { isAdmin, isProjectManager } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (changeRequests && changeRequests.ids.length > 0) {
      let sorted = changeRequests.ids.map(id => changeRequests.entities[id]);
      sorted.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
      setSortedChangeRequests(sorted);
    } else {
      setSortedChangeRequests([]);
    }
  }, [sortConfig, changeRequests]);

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  if (isLoading) return <p>Loading...</p>;
  if (isLoading) return <p>Loading...</p>;
  if (isError) {
    
    if (error.status === 400 && error.data.message === 'No Change Requests found') {
      return (
        <div className="container mt-5">
          <h2>{error.data.message}</h2>
          {(isAdmin || isProjectManager) && (
            <button className="btn btn-primary" onClick={() => navigate('/admin-dashboard/change-requests/create')}>
              Create New Change Request
            </button>
          )}
        </div>
      );
    }
    return <p>Error: {error.data.message}</p>;
  }
  
  if (sortedChangeRequests.length === 0) {
    return (
      <div className="container mt-5">
        <h2>No Change Requests Found</h2>
        {(isAdmin || isProjectManager) && (
          <button className="btn btn-primary" onClick={() => navigate('/admin-dashboard/change-requests/create')}>
            Create New Change Request
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Change Request List</h2>
      {(isAdmin || isProjectManager) && (
        <button className="btn btn-primary" onClick={() => navigate('/admin-dashboard/change-requests/create')}>
          Create New Change Request
        </button>
      )}
      <table className="table table-striped">
        <thead>
          <tr>
            <th onClick={() => requestSort('description')}>
              Description {sortConfig.key === 'description' ? (sortConfig.direction === 'ascending' ? '▼' : '▲') : ''}
            </th>
            <th onClick={() => requestSort('status')}>
              Status {sortConfig.key === 'status' ? (sortConfig.direction === 'ascending' ? '▼' : '▲') : ''}
            </th>
            <th onClick={() => requestSort('priority')}>
              Priority {sortConfig.key === 'priority' ? (sortConfig.direction === 'ascending' ? '▼' : '▲') : ''}
            </th>
            <th onClick={() => requestSort('creationDate')}>
              Creation Date {sortConfig.key === 'creationDate' ? (sortConfig.direction === 'ascending' ? '▼' : '▲') : ''}
            </th>
            {(isAdmin || isProjectManager) && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {console.log(sortedChangeRequests)}
          {sortedChangeRequests.map((changeRequest) => (
            <tr key={changeRequest._id}>
              <td>
                <Link to={`/changeRequests/${changeRequest._id}`}>{changeRequest.description}</Link>
              </td>
              <td>{changeRequest.status}</td>
              <td>{changeRequest.priority}</td>
              <td>{new Date(changeRequest.creationDate).toLocaleDateString()}</td>
              {(isAdmin || isProjectManager) && (
                <td>
                  <Link to={`/admin-dashboard/change-requests/${changeRequest._id}`}>Edit</Link>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ChangeRequestList;
