import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ProjectsList from './ProjectList';

const ProjectsDashboard = () => {
  
  const navigate = useNavigate();

  return (
    <div className="container mt-3">
        <h1>Project Dashboard</h1>
        <div className='row'>
            <div className='col'>
                <h2>Assigned projects</h2>
                <ProjectsList/>
            </div>
        </div>
        <div className='row'>
            <div className='col'>
                <h2>Completed projects</h2>
            </div>
        </div>
    </div>
  );
};

export default ProjectsDashboard;