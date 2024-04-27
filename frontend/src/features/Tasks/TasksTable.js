import React from 'react';
import { Table, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const TasksTable = ({ tasks, status, title }) => {
  const navigate = useNavigate()
  const filteredTasks = tasks.ids
    .map(id => tasks.entities[id])
    .filter(task => task.status === status);

  if (filteredTasks.length === 0) return <p>No {status.toLowerCase()} tasks available.</p>;

  const handleNavigation = (taskId) => {
    navigate(`/tasks/${taskId}`);
  };

  return (
    <div>
      <h3>{title}</h3>
      <Table className="table">
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
          {filteredTasks.map(task => (
            <tr key={task.id}>
              <td key={task.id} onClick={() =>handleNavigation(task.id)} style={{ cursor: 'pointer' }}>{task.id}</td>
              <td>{task.name}</td>
              <td>
                <Badge bg={task.status === 'Completed' ? 'success' : task.status === 'Cancelled' ? 'danger' : 'warning'}>
                  {task.status}
                </Badge>
              </td>
              <td>{task.priority}</td>
              <td>{task.assignedTo.map(person => `${person.firstName} ${person.surname}`).join(', ')}</td>
              <td>{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'N/A'}</td>
              <td>{task.taskType}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default TasksTable;
