import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useGetDesignsQuery, useLazyDownloadDesignQuery } from './designsApiSlice';
import useAuth from '../../hooks/useAuth';

const DesignList = () => {
  const { data: designs, isLoading, isError, error } = useGetDesignsQuery();
  const [triggerDownload, { isLoading: isDownloading }] = useLazyDownloadDesignQuery();
  const [sortedDesigns, setSortedDesigns] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'ascending' });
  const { isAdmin, isProjectManager, email } = useAuth();
  const navigate = useNavigate()

  useEffect(() => {
    if (designs && designs.ids.length > 0) {
      let sorted = designs.ids.map(id => designs.entities[id]);
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
  if (isLoading) return <p>Loading...</p>;
  if (isError) {
    if (error.status === 400 && error?.data?.message === 'No designs found') {
      return (
        <div className="container mt-5">
          <h2>{error.data.message}</h2>
          {(isAdmin || isProjectManager) && (
            <button className="btn btn-primary" onClick={() => navigate('/admin-dashboard/designs/create')}>
              Create New Change Request
            </button>
          )}
        </div>
      );
    }
    return <p>Error: {error?.data?.message}</p>;
  }

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Design List</h2>
      <button onClick={handleCreateNewDesign} className="btn btn-success mb-3">
                Create New Task
    </button>
      <table className="table table-striped">
        <thead>
          <tr>
            <th onClick={() => requestSort('name')}>
              Name {sortConfig.key === 'name' ? (sortConfig.direction === 'ascending' ? '▼' : '▲') : ''}
            </th>
            <th onClick={() => requestSort('status')}>
                Status {sortConfig.key === 'status' ? (sortConfig.direction === 'ascending' ? '▼' : '▲') : ''}
            </th>
            <th onClick={() => requestSort('productID')}>
                productID {sortConfig.key === 'productID' ? (sortConfig.direction === 'ascending' ? '▼' : '▲') : ''}
            </th>
            <th>Actions</th>
            <th>Download</th>
          </tr>
        </thead>
        <tbody>
            {console.log(sortedDesigns)}
          {sortedDesigns.map((design) => (
            <tr key={design.id}>
              <td>
                <Link to={`/designs/${design.id}`}>{design.name}</Link>
              </td>
              <td>{design.status}</td>
              <td>{design.productID}</td>
              <td>
                <Link to={`${design.id}`}>Edit</Link> {/* Adjust link as needed */}
              </td>
              <td>
              <button 
                    className="btn btn-secondary" 
                    onClick={() => handleDownload(design)}
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

export default DesignList;
