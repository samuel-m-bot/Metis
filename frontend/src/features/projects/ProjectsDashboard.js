import { useNavigate } from 'react-router-dom';
import ProjectsList from './ProjectList';
import { useGetAssignedProjectsQuery } from './projectsApiSlice';
import LoadingSpinner from "../../components/LoadingSpinner";
import useAuth from '../../hooks/useAuth';

const ProjectsDashboard = () => {
  const navigate = useNavigate();
  const { id, isAdmin, isProjectManager } = useAuth();

  const {
    data: assignedProjects,
    isLoading,
    isError,
    error
  } = useGetAssignedProjectsQuery(id);

  const handleCreateNewProject = () => {
    if(isAdmin) navigate('/admin-dashboard/projects/create');
    else if(isProjectManager)navigate('/projects/create');
  };

  if (isLoading) return <LoadingSpinner />;
  
  if (isError) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger" role="alert">
          <h4 className="alert-heading">Error Encountered!</h4>
          <p>{error?.data?.message || "An unexpected error occurred."}</p>
          <hr />
          {(isAdmin || isProjectManager) && (
            <div className="d-flex justify-content-between align-items-center">
              <p className="mb-0">No projects found or unable to load projects. You can create a new project to get started.</p>
              <button onClick={handleCreateNewProject} className="btn btn-success">
                Create New Project
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }
  

  // Filtering projects based on status
  const completedProjects = assignedProjects.ids.filter(
    id => assignedProjects.entities[id].status === 'Completed'
  ).map(id => assignedProjects.entities[id]);

  const ongoingProjects = assignedProjects.ids.filter(
    id => assignedProjects.entities[id].status !== 'Completed'
  ).map(id => assignedProjects.entities[id]);


  return (
    <div className="container mt-3">
      <h1>Project Dashboard</h1>
      <div className='row'>

          <div className='col'>
          <button className='btn btn-primary' onClick={()=> handleCreateNewProject()}>Create Project</button>
              <h2>Assigned projects</h2>
              <ProjectsList projects={ongoingProjects} />
          </div>
      </div>
      <div className='row'>
          <div className='col'>
              <h2>Completed projects</h2>
              <ProjectsList projects={completedProjects} />
          </div>
      </div>
    </div>
  );
};

export default ProjectsDashboard;
