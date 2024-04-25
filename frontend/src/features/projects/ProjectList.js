import { useNavigate } from "react-router-dom";
import Project from './Project';
import useAuth from '../../hooks/useAuth';

const ProjectsList = ({ projects }) => {
    const navigate = useNavigate();
    const { isAdmin, isProjectManager } = useAuth();

    const handleCreateNewProject = () => {
        navigate('/admin-dashboard/projects/create');
    };

    const canEdit = (isAdmin || isProjectManager);

    if (!projects.length) {
        return (
          <div>No projects to display</div>
        );
    }

    return (
        <div>
            {(isAdmin || isProjectManager) && (
                <button onClick={handleCreateNewProject} className="btn btn-success mb-3">
                    Create New Project
                </button>
            )}
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
                    {projects.map(project => (
                        <Project key={project._id} project={project} canEdit={canEdit} />
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ProjectsList;
