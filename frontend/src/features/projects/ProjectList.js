import React from 'react';
import { useNavigate } from "react-router-dom";
import { useGetProjectsQuery } from './projectsApiSlice';
import Project from './Project';
import LoadingSpinner from "../../components/LoadingSpinner";

const ProjectsList = () => {
    const navigate = useNavigate();
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
    if (isError) return <p>Error: {error.message}</p>;

    // Check if there are project IDs
    if (!projects.ids.length) {
        return (
            <div>
                <button onClick={handleCreateNewProject} className="btn btn-success mb-3">
                    Create New Project
                </button>
                <p>No projects found. Click above to create a new project.</p>
            </div>
        );
    }

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
                    {projects.ids.map(projectId => <Project key={projectId} project={projects.entities[projectId]} />)}
                </tbody>
            </table>
        </div>
    );
};

export default ProjectsList;
