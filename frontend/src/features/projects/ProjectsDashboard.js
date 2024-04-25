import { useNavigate } from 'react-router-dom';
import ProjectsList from './ProjectList';
import { useGetAssignedProjectsQuery } from './projectsApiSlice';
import LoadingSpinner from "../../components/LoadingSpinner";
import useAuth from '../../hooks/useAuth';

const ProjectsDashboard = () => {
  const navigate = useNavigate();
  const { id } = useAuth();

  const {
    data: assignedProjects,
    isLoading,
    isError,
    error
  } = useGetAssignedProjectsQuery(id);

  if (isLoading) return <LoadingSpinner />;
  if (isError) {
    return <p>Error: {error.message}</p>;
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
