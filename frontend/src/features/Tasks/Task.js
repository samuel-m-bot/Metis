import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from 'react-router-dom';

const Task = ({ task }) => {
    const navigate = useNavigate();

    const handleEdit = () => navigate(`/admin-dashboard/tasks/edit/${task._id}`);

    return (
        <tr>
            <td>{task.name}</td>
            <td>{task.description}</td>
            <td>{task.status}</td>
            <td>{task.priority}</td>
            <td>{task.assignedTo.map(user => `${user.firstName} ${user.surname}`).join(', ')}</td>
            <td>{task.taskType}</td>
            <td>{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'N/A'}</td>
            <td>
                <button className="btn btn-info" onClick={handleEdit}>
                    <FontAwesomeIcon icon={faPenToSquare} />
                </button>
            </td>
        </tr>
    );
};

export default Task;
