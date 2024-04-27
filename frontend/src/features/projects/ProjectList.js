import Project from './Project';
import useAuth from '../../hooks/useAuth';

const ProjectsList = ({ projects }) => {
    const { isAdmin, isProjectManager } = useAuth();

    const canEdit = (isAdmin || isProjectManager);

    if (!projects) {
        return (
          <div>No projects to display</div>
        );
    }

    return (
        <div>
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
