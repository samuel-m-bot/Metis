import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const initialDocuments = [
  { id: 1, name: 'Document A', category: 'Electronics', releaseDate: '2022-01-01', documentId: 'A123' },
  { id: 2, name: 'Document B', category: 'Software', releaseDate: '2022-05-15', documentId: 'B456' },
  { id: 3, name: 'Document C', category: 'Hardware', releaseDate: '2022-07-22', documentId: 'C789' },
];

const DocumentList = () => {
  const [documents, setDocuments] = useState(initialDocuments);
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'ascending' });

  useEffect(() => {
    let sortedDocuments = [...initialDocuments];
    sortedDocuments.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
    setDocuments(sortedDocuments);
  }, [sortConfig]);

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Document List</h2>
      <table className="table table-striped">
        <thead>
          <tr>
            <th onClick={() => requestSort('name')}>
              Name {sortConfig.key === 'name' ? (sortConfig.direction === 'ascending' ? '▼' : '▲') : ''}
            </th>
            <th onClick={() => requestSort('category')}>
              Category {sortConfig.key === 'category' ? (sortConfig.direction === 'ascending' ? '▼' : '▲') : ''}
            </th>
            <th onClick={() => requestSort('releaseDate')}>
              Release Date {sortConfig.key === 'releaseDate' ? (sortConfig.direction === 'ascending' ? '▼' : '▲') : ''}
            </th>
            <th onClick={() => requestSort('documentId')}>
              Document ID {sortConfig.key === 'documentId' ? (sortConfig.direction === 'ascending' ? '▼' : '▲') : ''}
            </th>
          </tr>
        </thead>
        <tbody>
          {documents.map((document) => (
            <tr key={document.id}>
              <td>
                <Link to={`/documents/${document.documentId}`}>{document.name}</Link>
              </td>
              <td>{document.category}</td>
              <td>{document.releaseDate}</td>
              <td>{document.documentId}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DocumentList;
