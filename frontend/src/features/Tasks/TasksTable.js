import React from 'react';

const TasksTable = ({ tasks, title }) => {
  return (
    <div>
      <h3>{title}</h3>
      {tasks.length > 0 ? (
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Start</th>
              <th>End</th>
              <th>Assigned To</th>
              <th>Issued By</th>
              <th>Related Documents</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task.id}>
                <td>{task.id}</td>
                <td>{task.title}</td>
                <td>{new Date(task.start).toLocaleDateString()}</td>
                <td>{task.end ? new Date(task.end).toLocaleDateString() : 'N/A'}</td>
                <td>{task.assignedTo}</td>
                <td>{task.issuedBy}</td>
                <td>{task.relatedDocuments.join(', ')}</td>
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
