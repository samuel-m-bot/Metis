import React from 'react';
import { useNavigate } from 'react-router-dom';

const DesignTable = ({ designs }) => {
  const navigate = useNavigate();

  const handleViewDesign = (designId) => {
    navigate(`/designs/${designId}`);
  };

  return (
    <table className="table design-table">
      <thead>
        <tr>
          <th>Product</th>
          <th>Version</th>
          <th>Status</th>
          <th>Designer</th>
          <th>Creation Date</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {designs.map((design) => (
          <tr key={design._id}>
            <td>{design.productID}</td>
            <td>{design.version}</td>
            <td>{design.status}</td>
            <td>{design.designer}</td>
            <td>{new Date(design.creationDate).toLocaleDateString()}</td>
            <td>
              <button className="btn btn-info" onClick={() => handleViewDesign(design._id)}>View Details</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default DesignTable;
