import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useGetDocumentsQuery, useLazyDownloadDocumentQuery } from './documentsApiSlice';
import useAuth from '../../hooks/useAuth';

const DocumentList = () => {
  const { data: documents, isLoading, isError, error } = useGetDocumentsQuery();
  const [triggerDownload, { isLoading: isDownloading }] = useLazyDownloadDocumentQuery();
  const [sortedDocuments, setSortedDocuments] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'ascending' });
  const { isAdmin, isProjectManager, email } = useAuth();
  const navigate = useNavigate()

  useEffect(() => {
    if (documents && documents.ids.length > 0) {
      let sorted = documents.ids.map(id => documents.entities[id]);
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
    } else {
      setSortedDocuments([]);
    }
  }, [sortConfig, documents]);

  const handleDirectDownload = async (documentId) => {
    try {
        const response = await fetch(`http://localhost:3500/documents/download/${documentId}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const blob = await response.blob();
        console.log('Blob Size:', blob.size);

        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'downloaded_file.docx');
        document.body.appendChild(link);
        link.click();

        window.URL.revokeObjectURL(url);
        document.body.removeChild(link);
    } catch (error) {
        console.error('Failed to directly download the document:', error);
    }
};
const handleDownload = async (documentId) => {
  try {
      const { blob, filename } = await triggerDownload(documentId).unwrap();

      console.log('Download Filename:', filename);
      console.log('Download Blob:', blob);
      console.log('Download Blob Size:', blob?.size);  
      console.log('Download Blob Type:', blob?.type);

      if (!blob || blob.size === 0) {
          throw new Error("Blob data is missing or invalid.");
      }

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();

      window.URL.revokeObjectURL(url);
      link.remove();
  } catch (error) {
      console.error('Failed to download the document:', error);
  }
};

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const handleCreateNewDocument = () => {
    navigate('/admin-dashboard/documents/create');
};
  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error: {error.message}</p>;
  if (sortedDocuments.length === 0) return (
    <div className="container mt-5">
      <h2>No Documents Found</h2>
      {(isAdmin || isProjectManager) && (
        <button className="btn btn-primary" onClick={handleCreateNewDocument}>
          Create New Document
        </button>
      )}
    </div>
  );

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Document List</h2>
      <button onClick={handleCreateNewDocument} className="btn btn-success mb-3">
                Create New Task
    </button>
      <table className="table table-striped">
        <thead>
          <tr>
            <th onClick={() => requestSort('title')}>
              Title {sortConfig.key === 'title' ? (sortConfig.direction === 'ascending' ? '▼' : '▲') : ''}
            </th>
            <th onClick={() => requestSort('status')}>
                Status {sortConfig.key === 'status' ? (sortConfig.direction === 'ascending' ? '▼' : '▲') : ''}
            </th>
            <th onClick={() => requestSort('productID')}>
                Proejct id {sortConfig.key === 'productID' ? (sortConfig.direction === 'ascending' ? '▼' : '▲') : ''}
            </th>
            <th>Actions</th>
            <th>Download</th>
          </tr>
        </thead>
        <tbody>
            {console.log(sortedDocuments)}
          {sortedDocuments.map((document) => (
            <tr key={document.id}>
              <td>
                <Link to={`/documents/${document.id}`}>{document.title}</Link>
              </td>
              <td>{document.status}</td>
              <td>{document.projectId}</td>
              <td>
                <Link to={`${document.id}`}>Edit</Link>
              </td>
              <td>
              <button 
                    className="btn btn-secondary" 
                    onClick={() => handleDownload(document.id)}
                    disabled={isDownloading}>
                    Download
            </button>
            </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DocumentList;
