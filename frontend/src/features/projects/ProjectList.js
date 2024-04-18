import React from 'react';
import { useNavigate } from "react-router-dom";
import { useGetProjectsQuery } from './projectsApiSlice';
import Project from './Project';
import LoadingSpinner from "../../components/LoadingSpinner";
import useAuth from '../../hooks/useAuth';

const ProjectsList = () => {
    const navigate = useNavigate();
    const {isAdmin, isProjectManager} = useAuth()
    const { 
        data: projects, 
        isLoading, 
        isError, 
        error } = useGetProjectsQuery('projectList', {
            pollingInterval: 60000,
            refetchOnFocus: true,
            refetchOnMountOrArgChange: true
        })

    const handleCreateNewProject = () => {
        navigate('/admin-dashboard/projects/create');
    };

    if (isLoading) return <LoadingSpinner />;
    if (isError) {
    
        if (error.status === 400 && error.data.message === 'No projects found') {
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
      
      if (projects.length === 0) {
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

    const canEdit = (isAdmin || isProjectManager)
    return (
        <div>
            <button onClick={handleCreateNewProject} className="btn btn-success mb-3">
                Create New Project
            </button>
            <table className="table">
                <thead className="thead-dark">
                    <tr>
                        <th scope="col">Name</th>
                        <th scope="col">Description</th>
                        <th scope="col">Status</th>
                        <th scope="col">Start Date</th>
                        <th scope="col">End Date</th>
                        <th scope="col">Project Manager</th>
                        <th scope="col">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {projects.ids.map(projectId => <Project key={projectId} project={projects.entities[projectId]} canEdit={canEdit} />)}
                </tbody>
            </table>
        </div>
    );
};

export default ProjectsList;
