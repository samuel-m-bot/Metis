import React from 'react';
import './Home.css';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

const tasks = [
  {
    taskId: 'T001',
    taskType: 'Review Document',
    affectedItem: 'Document A',
    details: 'Review the latest changes.'
  },
  {
    taskId: 'T002',
    taskType: 'Update Design',
    affectedItem: 'Design X',
    details: 'Incorporate feedback from latest review.'
  },
  {
    taskId: 'T003',
    taskType: 'Approve change request',
    affectedItem: 'Test Case 5',
    details: 'Ensure test covers all new scenarios.'
  }
];

const Home = () => {
  const navigate = useNavigate();
  const { isAdmin } = useAuth(); // Use useAuth to get the isAdmin status

  const handleTaskClick = (taskId) => {
    navigate(`/tasks/${taskId}`);
  };

  return (
    <div className="container">
      <h1 className="text-center my-4">Welcome to Your <span className="metis-green">Metis</span> Dashboard</h1>
      <div className="row">
        <div className="col-md-4">
          <h2>Quick Links</h2>
          <ul className="list-group">
            <li className="list-group-item"><a href="/projects">Projects Dashboard</a></li>
            <li className="list-group-item"><a href="/products">Product List</a></li>
            <li className="list-group-item"><a href="/designs">Design management</a></li>
            <li className="list-group-item"><a href="/documents">Document Library</a></li>
            {isAdmin && <li className="list-group-item"><a href="/admin-dashboard">Admin Dashboard</a></li>} 
          </ul>
        </div>
        <div className="col-md-8">
          <h2>Overview</h2>
          <p>Your latest activities and updates will appear here...</p>
        </div>
      </div>
      <div className='row' id='activity-row'>
        <h1 className='text-center'>Assigned Tasks</h1>
        <table className="table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Type</th>
              <th scope="col">Task ID</th>
              <th scope="col">Affected Item</th>
              <th scope="col">Details</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task, index) => (
              <tr key={task.taskId}>
                <th scope="row">{index + 1}</th>
                <td>
                  <a href="#" onClick={() => handleTaskClick(task.taskId)} style={{ cursor: 'pointer' }}>
                    {task.taskType}
                  </a>
                </td>
                <td>{task.taskId}</td>
                <td>{task.affectedItem}</td>
                <td>{task.details}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Home;
