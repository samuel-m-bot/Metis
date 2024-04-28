import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { useGetTasksQuery } from './tasksApiSlice';
import Task from './Task';
import LoadingSpinner from "../../components/LoadingSpinner";
import useAuth from '../../hooks/useAuth';

const TasksList = () => {
    const navigate = useNavigate();
    const { isAdmin, isProjectManager } = useAuth();
    const [currentPage, setCurrentPage] = useState(1);
    const { data, isLoading, isError, error } = useGetTasksQuery(currentPage);

    const handleCreateNewTask = () => {
        navigate('/admin-dashboard/tasks/create');
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    if (isLoading) return <LoadingSpinner />;
    if (isError) {
        if (error.status === 400 && error?.data?.message === 'No tasks found') {
            return (
                <div className="container mt-5">
                    <h2>{error.data.message}</h2>
                    {(isAdmin || isProjectManager) && (
                        <button className="btn btn-primary" onClick={handleCreateNewTask}>
                            Create New Change Request
                        </button>
                    )}
                </div>
            );
        }
        return <p>Error: {error?.data?.message}</p>;
    }

    return (
        <div>
            <button onClick={handleCreateNewTask} className="btn btn-success mb-3">
                Create New Task
            </button>
            <table className="table">
                <thead className="thead-dark">
                    <tr>
                        <th scope="col">Name</th>
                        <th scope="col">Description</th>
                        <th scope="col">Status</th>
                        <th scope="col">Priority</th>
                        <th scope="col">Assigned To</th>
                        <th scope="col">Type</th>
                        <th scope="col">Due Date</th>
                        <th scope="col">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {data?.tasks?.ids.map(taskId => <Task key={taskId} task={data.tasks.entities[taskId]} />)}
                </tbody>
            </table>
            <nav>
                <ul className="pagination">
                    {Array.from({ length: data.totalPages }, (_, i) => (
                        <li key={i + 1} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                            <button className="page-link" onClick={() => handlePageChange(i + 1)}>
                                {i + 1}
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>
        </div>
    );
};

export default TasksList;
