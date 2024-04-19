import React, { useEffect, useState } from 'react';
import { useFilterTasksByStatusMutation } from './tasksApiSlice';
const TasksTable = ({ taskIds, status, title }) => {
  const [tasks, setTasks] = useState([]);
  const [filterTasksByStatus, { data, isLoading, isError }] = useFilterTasksByStatusMutation();

  useEffect(() => {
    if (taskIds && status) {
      filterTasksByStatus({ taskIds, status }).then(response => {
        if (response.data) setTasks(response.data);
      });
    }
  }, [taskIds, status, filterTasksByStatus]);

  if (isLoading) return <p>Loading tasks...</p>;
  if (isError) return <p>Error loading tasks.</p>;

  return (
    <div>
      <h3>{title}</h3>
      {console.log(tasks)}
      {tasks?.length > 0 ? (
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Status</th>
              <th>Priority</th>
              <th>Assigned To</th>
              <th>Due Date</th>
              <th>Task Type</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task._id}>
                <td>{task._id}</td>
                <td>{task.name}</td>
                <td>{task.status}</td>
                <td>{task.priority}</td>
                <td>{task.assignedTo.map((person) => person.firstName + ' ' + person.surname).join(', ')}</td>
                <td>{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'N/A'}</td>
                <td>{task.taskType}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No tasks available.</p>
      )}
    </div>
  );
};

export default TasksTable;
