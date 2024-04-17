import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from 'react-router-dom';
import { useGetUserByIdQuery } from '../users/usersApiSlice';
import LoadingSpinner from "../../components/LoadingSpinner";

const Project = ({ project }) => {
    const navigate = useNavigate();
    const {
        data: projectManager,
        isFetching,
        isError
    } = useGetUserByIdQuery(project.projectManagerID);

    const handleEdit = () => navigate(`/admin-dashboard/projects/${project._id}`);

    if (isFetching) return <tr><td colSpan="7"><LoadingSpinner /></td></tr>;
    if (isError || !projectManager) return <tr><td colSpan="7">Project manager not found.</td></tr>;

    return (
        <tr>
            <td>{project.name}</td>
            <td>{project.description}</td>
            <td>{project.status}</td>
            <td>{project.startDate ? new Date(project.startDate).toLocaleDateString() : 'N/A'}</td>
            <td>{project.endDate ? new Date(project.endDate).toLocaleDateString() : 'N/A'}</td>
            <td>{projectManager.firstName} {projectManager.surname}</td>
            <td>
                <button className="btn btn-info" onClick={handleEdit}>
                    <FontAwesomeIcon icon={faPenToSquare} />
                </button>
            </td>
        </tr>
    );
};

export default Project;
