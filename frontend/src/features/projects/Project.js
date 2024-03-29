import React from 'react';
import { useNavigate } from 'react-router-dom';

const Project = ({ project }) => {
  const navigate = useNavigate();

  const handleViewProject = () => {
    navigate(`/projects/${project.id}`, { state: { project } });
  };

  return (
    <tr>
      <td>{project.name}</td>
      <td>{new Date(project.startDate).toLocaleDateString()}</td>
      <td>{project.endDate ? new Date(project.endDate).toLocaleDateString() : 'N/A'}</td>
      <td>{project.status}</td>
      <td>{project.description}</td>
      <td>
        <button onClick={handleViewProject} className="btn btn-info">View Project Dashboard</button>
      </td>
    </tr>
  );
};

export default Project;
