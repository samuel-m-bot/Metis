import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const initialDesigns = [
  { id: 1, title: 'Design A', version: '1.0', status: 'Completed', designer: 'Designer 1', lastModified: '2023-01-01' },
  { id: 2, title: 'Design B', version: '0.5', status: 'In Progress', designer: 'Designer 2', lastModified: '2023-02-15' },
  { id: 3, title: 'Design C', version: '2.0', status: 'Reviewed', designer: 'Designer 3', lastModified: '2023-03-22' },
];

const DesignManagement = () => {
  const [designs, setDesigns] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'title', direction: 'ascending' });

  useEffect(() => {
    let sortedDesigns = [...initialDesigns];
    sortedDesigns.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
    setDesigns(sortedDesigns);
  }, [sortConfig]);

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const handleCreateDesign = () => {
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };
  return (
    <div className="container-fluid design-management">
  <div className="row mb-4">
    <div className="col">
      <h2>Design Management</h2>
    </div>
  </div>

  <div className="row mb-3">
    <div className="col-md-4">
      <button className="btn btn-primary" onClick={handleCreateDesign}>Create New Design</button>
    </div>
    <div className="col-md-8">
      <input type="text" className="form-control" placeholder="Search designs..." onChange={handleSearchChange}/>
    </div>
  </div>

  <div className="row">
    <div className="col">
    <h2 className="mb-4">Design Management</h2>
      <table className="table table-striped">
        <thead>
          <tr>
            <th onClick={() => requestSort('title')}>
              Title {sortConfig.key === 'title' ? (sortConfig.direction === 'ascending' ? '▼' : '▲') : ''}
            </th>
            <th onClick={() => requestSort('version')}>
              Version {sortConfig.key === 'version' ? (sortConfig.direction === 'ascending' ? '▼' : '▲') : ''}
            </th>
            <th onClick={() => requestSort('status')}>
              Status {sortConfig.key === 'status' ? (sortConfig.direction === 'ascending' ? '▼' : '▲') : ''}
            </th>
            <th onClick={() => requestSort('designer')}>
              Designer {sortConfig.key === 'designer' ? (sortConfig.direction === 'ascending' ? '▼' : '▲') : ''}
            </th>
            <th onClick={() => requestSort('lastModified')}>
              Last Modified {sortConfig.key === 'lastModified' ? (sortConfig.direction === 'ascending' ? '▼' : '▲') : ''}
            </th>
          </tr>
        </thead>
        <tbody>
          {designs.map((design) => (
            <tr key={design.id}>
              <td>
                <Link to={`/designs/${design.id}`}>{design.title}</Link>
              </td>
              <td>{design.version}</td>
              <td>{design.status}</td>
              <td>{design.designer}</td>
              <td>{design.lastModified}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
</div>

  )
}

export default DesignManagement