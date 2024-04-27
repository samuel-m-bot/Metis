import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetUserTasksQuery } from './tasksApiSlice';
import { Table, Badge, Pagination } from 'react-bootstrap';

const UserTasks = ({ userId }) => {
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10; 
    const [sortConfig, setSortConfig] = useState(null);

    const {
        data: tasks,
        isLoading,
        isError,
        error
    } = useGetUserTasksQuery({ userId, page: currentPage, limit: pageSize }, {
        pollingInterval: 60000,
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true
    });

    if (isLoading) return <p>Loading tasks...</p>;
    if (isError) {
        return <p>Error: {error?.data?.message || 'An error occurred'}</p>;
    }

    const handleTaskClick = taskId => {
        navigate(`/tasks/${taskId}`);
    };

    // Handle sorting and pagination controls
    const sortedTasks = tasks && tasks.tasks && tasks.tasks.ids ? [...tasks.tasks.ids].sort((a, b) => {
        if (!sortConfig) return 0;
        const taskA = tasks.tasks.entities[a][sortConfig.key];
        const taskB = tasks.tasks.entities[b][sortConfig.key];
        if (taskA < taskB) {
            return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (taskA > taskB) {
            return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
    }) : [];

    const handleSorting = key => {
        let direction = 'ascending';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    // Ensure tasks object is valid before rendering the table
    if (!tasks || !tasks.tasks || !tasks.tasks.ids) {
        return <div>No tasks available or still loading.</div>;
    }

    const totalPages = tasks.totalPages || 0;

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
                            <td>{tasks.tasks.entities[taskId].taskType}</td>
                            <td>
                                <Badge bg={
                                    tasks.tasks.entities[taskId].status === 'Completed' ? 'success' :
                                    tasks.tasks.entities[taskId].status === 'Cancelled' ? 'danger' :
                                    'warning'}>
                                    {tasks.tasks.entities[taskId].status}
                                </Badge>
                            </td>
                            <td>{taskId}</td>
                            <td>{tasks.tasks.entities[taskId].name}</td>
                            <td>{tasks.tasks.entities[taskId].description}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            {totalPages > 1 && (
                <Pagination className="justify-content-center">
                    {[...Array(totalPages).keys()].map(p => (
                        <Pagination.Item key={p + 1} active={p + 1 === currentPage} onClick={() => setCurrentPage(p + 1)}>
                            {p + 1}
                        </Pagination.Item>
                    ))}
                </Pagination>
            )}
        </div>
    );
};

export default UserTasks;
