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
            <h1 className='text-center'>Assigned Tasks</h1>
            <table className="table">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Type</th>
                        <th scope="col">status</th>
                        <th scope="col">Task ID</th>
                        <th scope="col">Affected Item</th>
                        <th scope="col">Details</th>
                    </tr>
                </thead>
                <tbody>
                    {tasks && tasks?.ids.map((taskId, index) => (
                        <tr key={taskId}>
                            <th scope="row">{index + 1}</th>
                            <td>
                                <a href="#" onClick={() => handleTaskClick(taskId)} style={{ cursor: 'pointer' }}>
                                    {tasks.entities[taskId].taskType}
                                </a>
                            </td>
                            <td>{tasks.entities[taskId].status}</td>
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
