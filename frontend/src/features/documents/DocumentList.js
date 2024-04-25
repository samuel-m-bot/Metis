import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

const DocumentList = ({ documents, isLoading, isError, error }) => {
  const [sortedDocuments, setSortedDocuments] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'ascending' });
  const { isAdmin, isProjectManager } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    let sorted = [...documents];
    sorted.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
    setSortedDocuments(sorted);
  }, [sortConfig, documents]);

  const handleCreateNewDocument = () => {
    navigate('/admin-dashboard/documents/create');
  };

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  if (isLoading) return <p>Loading...</p>;
  if (isError) {
    if (error.status === 400 && error?.data?.message === 'No documents found') {
      return (
        <div className="container mt-5">
          <h2>{error.data.message}</h2>
          {(isAdmin || isProjectManager) && (
            <button className="btn btn-primary" onClick={handleCreateNewDocument}>
              Create New Document
            </button>
          )}
        </div>
      );
    }
    return <p>Error: {error?.data?.message || error.message}</p>;
  }

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Document List</h2>
      <button onClick={handleCreateNewDocument} className="btn btn-success mb-3">
        Create New Document
      </button>
      <table className="table table-striped">
        <thead>
          <tr>
            <th onClick={() => requestSort('title')}>Title {sortConfig.key === 'title' ? (sortConfig.direction === 'ascending' ? '▼' : '▲') : ''}</th>
            <th onClick={() => requestSort('status')}>Status {sortConfig.key === 'status' ? (sortConfig.direction === 'ascending' ? '▼' : '▲') : ''}</th>
            <th onClick={() => requestSort('projectId')}>Project {sortConfig.key === 'projectId' ? (sortConfig.direction === 'ascending' ? '▼' : '▲') : ''}</th>
            {(isAdmin || isProjectManager) && (
            <th>Actions</th> 
            )}
          </tr>
        </thead>
        <tbody>
          {sortedDocuments.map((document) => (
            <tr key={document.id}>
              <td><Link to={`/documents/${document.id}`}>{document.title}</Link></td>
              <td>{document.status}</td>
              <td>{document.projectId.name}</td>
              {(isAdmin || isProjectManager) && (
                <td><Link to={`/documents/edit/${document.id}`} className="btn btn-primary btn-sm">Edit</Link></td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DocumentList;
