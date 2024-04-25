import React from 'react';
import './Home.css';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import UserTasks from '../Tasks/UserTasks';

const Home = () => {
  const navigate = useNavigate();
  const { isAdmin, id } = useAuth();
  

  return (
    <div className="container">
      <h1 className="text-center my-4">Welcome to Your <span className="metis-green">Metis</span> Dashboard</h1>
      <div className="row">
        <div className="col-md-4">
          <h2>Quick Links</h2>
          <ul className="list-group">
            <li className="list-group-item"><a href="/projects">Projects Dashboard</a></li>
            <li className="list-group-item"><a href="/products">Products List</a></li>
            <li className="list-group-item"><a href="/designs">Designs List</a></li>
            <li className="list-group-item"><a href="/documents">Document Library</a></li>
            {isAdmin && <li className="list-group-item"><a href="/admin-dashboard">Admin Dashboard</a></li>} 
          </ul>
        </div>
        <div className="col-md-8">
          <h2>Overview</h2>
          <p>Your latest activities and updates will appear here...</p>
        </div>
      </div>
      {id && (
        <UserTasks userId={id}/>
      )}
    </div>
  )
}

export default Home;
