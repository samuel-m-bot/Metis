import { useNavigate } from 'react-router-dom';
import { useGetUserTasksQuery } from './tasksApiSlice';

const UserTasks = ({ userId }) => {
    const navigate = useNavigate();
    const {
        data: tasks,
        isLoading,
        isError,
        error
    } = useGetUserTasksQuery(userId, {
        pollingInterval: 60000,
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true
    });

    const handleTaskClick = (taskId) => {
        navigate(`/tasks/${taskId}`);
    };

    if (isLoading) return <p>Loading tasks...</p>;
    if (isError) {
        if (error?.status === 404) {
            return (
                <div className="container mt-5">
                    <h2>{error.data?.message || 'No tasks found'}</h2>
                </div>
            );
        }
        return <p>Error: {error?.data?.message || 'An error occurred'}</p>;
    }

    return (
        <div className='row' id='activity-row'>
            <h1 className='text-center mb-3'>Assigned Tasks</h1>
            <table className="table table-hover">
                <thead className="table-dark">
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Type</th>
                        <th scope="col">Status</th>
                        <th scope="col">Task ID</th>
                        <th scope="col">Affected Item</th>
                        <th scope="col">Details</th>
                    </tr>
                </thead>
                <tbody>
                    {tasks && tasks.ids.map((taskId, index) => (
                        <tr key={taskId} onClick={() => handleTaskClick(taskId)} style={{ cursor: 'pointer' }}>
                            <th scope="row">{index + 1}</th>
                            <td>{tasks.entities[taskId].taskType}</td>
                            <td>
                                <span className={`badge ${
                                    tasks.entities[taskId].status === 'Completed' ? 'bg-success' :
                                    tasks.entities[taskId].status === 'Cancelled' ? 'bg-danger' :
                                    'bg-warning'}`}>
                                    {tasks.entities[taskId].status}
                                </span>
                            </td>
                            <td>{taskId}</td>
                            <td>{tasks.entities[taskId].name}</td>
                            <td>{tasks.entities[taskId].description}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default UserTasks;
