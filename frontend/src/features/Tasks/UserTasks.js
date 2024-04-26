import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useGetUserTasksQuery } from './tasksApiSlice';
import { Table, Badge, Button } from 'react-bootstrap';

const UserTasks = ({ userId }) => {
    const navigate = useNavigate();
    const [sortConfig, setSortConfig] = useState(null);

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

    const sortedTasks = tasks ? [...tasks.ids].sort((a, b) => {
        if (!sortConfig) return 0;
        const taskA = tasks.entities[a][sortConfig.key];
        const taskB = tasks.entities[b][sortConfig.key];
        if (taskA < taskB) {
            return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (taskA > taskB) {
            return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
    }) : [];

    const handleSorting = (key) => {
        let direction = 'ascending';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
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
            <Table hover responsive>
                <thead className="table-dark">
                    <tr>
                        <th>#</th>
                        <th onClick={() => handleSorting('taskType')}>Type</th>
                        <th onClick={() => handleSorting('status')}>Status</th>
                        <th>Task ID</th>
                        <th>Affected Item</th>
                        <th>Details</th>
                    </tr>
                </thead>
                <tbody>
                    {sortedTasks.map((taskId, index) => (
                        <tr key={taskId} onClick={() => handleTaskClick(taskId)} style={{ cursor: 'pointer' }}>
                            <td>{index + 1}</td>
                            <td>{tasks.entities[taskId].taskType}</td>
                            <td>
                                <Badge bg={
                                    tasks.entities[taskId].status === 'Completed' ? 'success' :
                                    tasks.entities[taskId].status === 'Cancelled' ? 'danger' :
                                    'warning'}>
                                    {tasks.entities[taskId].status}
                                </Badge>
                            </td>
                            <td>{taskId}</td>
                            <td>{tasks.entities[taskId].name}</td>
                            <td>{tasks.entities[taskId].description}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
};

export default UserTasks;
