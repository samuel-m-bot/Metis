import React from 'react';
import { useNavigate } from "react-router-dom";
import { useGetTasksQuery } from './tasksApiSlice';
import Task from './Task';
import LoadingSpinner from "../../components/LoadingSpinner";

const TasksList = () => {
    const navigate = useNavigate();
    const { data: tasks, isLoading, isError, error } = useGetTasksQuery();

    const handleCreateNewTask = () => {
        navigate('/admin-dashboard/tasks/create');
    };

    if (isLoading) return <LoadingSpinner />;
    if (isError) return <p>Error: {error.message}</p>;

    if (!tasks.length) {
        return (
            <div>
                <button onClick={handleCreateNewTask} className="btn btn-success mb-3">
                    Create New Task
                </button>
                <p>No tasks found. Click above to create a new task.</p>
            </div>
        );
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
                    {tasks.map(task => <Task key={task._id} task={task} />)}
                </tbody>
            </table>
        </div>
    );
};

export default TasksList;
