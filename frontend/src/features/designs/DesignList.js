import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { useLazyDownloadDesignQuery } from './designsApiSlice';

const DesignList = ({ designs }) => {
  const [sortedDesigns, setSortedDesigns] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'ascending' });
  const { isAdmin, isProjectManager } = useAuth();
  const [triggerDownload, { isLoading: isDownloading }] = useLazyDownloadDesignQuery();
  const navigate = useNavigate();

  useEffect(() => {
    if (designs && designs.length > 0) {
      let sorted = [...designs];
      sorted.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
      setSortedDesigns(sorted);
    } else {
      setSortedDesigns([]);
    }
  }, [sortConfig, designs]);

  const handleDownload = async (design) => {
    // Extract the file extension from the fileName
    const fileExtension = design.attachment.fileName.split('.').pop();
    
    // Trigger the lazy query
    const result = await triggerDownload(design.id).unwrap();
    
    // Create a blob link to download
    const url = window.URL.createObjectURL(new Blob([result]));
    const link = document.createElement('a');
    link.href = url;
    
    // Use the file extension for the download attribute
    link.setAttribute('download', `design_${design.id}.${fileExtension}`);
    
    document.body.appendChild(link);
    link.click();
    
    // Cleanup
    window.URL.revokeObjectURL(url);
    link.remove();
  };

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const handleCreateNewDesign = () => {
    navigate('/admin-dashboard/designs/create');
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Design List</h2>
      {(isAdmin || isProjectManager) && (
          <button onClick={handleCreateNewDesign} className="btn btn-success mb-3">
              Create New Design
          </button>
      )}
      <div className="table-responsive">
          <table className="table table-striped table-hover">
              <thead>
                  <tr>
                      <th onClick={() => requestSort('name')} style={{ cursor: 'pointer' }}>
                          Name {sortConfig.key === 'name' ? (sortConfig.direction === 'ascending' ? '▼' : '▲') : ''}
                      </th>
                      <th onClick={() => requestSort('status')} style={{ cursor: 'pointer' }}>
                          Status {sortConfig.key === 'status' ? (sortConfig.direction === 'ascending' ? '▼' : '▲') : ''}
                      </th>
                      <th onClick={() => requestSort('productID')} style={{ cursor: 'pointer' }}>
                          Product ID {sortConfig.key === 'productID' ? (sortConfig.direction === 'ascending' ? '▼' : '▲') : ''}
                      </th>
                      <th>Actions</th>
                  </tr>
              </thead>
              <tbody>
                  {sortedDesigns.map((design) => (
                      <tr key={design.id}>
                          <td>
                              <Link to={`/designs/${design.id}`}>{design.name}</Link>
                          </td>
                          <td>{design.status}</td>
                          <td>{design.productID}</td>
                          <td>
                              <div className="btn-group">
                                {(isAdmin || isProjectManager) && (
                                  <Link to={`/admin-dashboard/designs/edit/${design.id}`} className="btn btn-primary btn-sm">
                                    Edit
                                  </Link>
                                )}
                                  <button className="btn btn-secondary btn-sm" onClick={() => handleDownload(design)}>
                                      Download
                                  </button>
                              </div>
                          </td>
                      </tr>
                  ))}
              </tbody>
          </table>
      </div>
  </div>
  );
};

export default DesignList;
