import React from 'react';
import { useState } from 'react';
import './Home.css';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import UserTasks from '../Tasks/UserTasks';
import UserActivityList from '../activity/UserActivityList';
import { useSalesforceLoginMutation, useLazyCheckAccessTokenQuery } from '../auth/authApiSlice';

const Home = () => {
  const navigate = useNavigate();
  const { isAdmin, id, firstName, surname } = useAuth();
  const [salesforceLogin] = useSalesforceLoginMutation();
  const [triggerCheckAccessToken, { data: accessTokenData, isSuccess, isError, error }] = useLazyCheckAccessTokenQuery();
  const [loading, setLoading] = useState(false);

  const handleSalesforceLogin = () => {
    window.location.href = "http://localhost:3500/auth/salesforce"; 
  };

  const handleCheckAccessToken = () => {
    triggerCheckAccessToken();  
  };

  return (
    <div className="container">
      <h1 className="text-center my-4">Welcome to Your <span className="metis-green">Metis</span> Dashboard, {firstName}</h1>
      <div className="row">
        <div className="col-md-4">
          <h2>Quick Links</h2>
          <ul className="list-group">
            <li className="list-group-item"><a href="/projects">Projects Dashboard</a></li>
            <li className="list-group-item"><a href="/products">Products List</a></li>
            <li className="list-group-item"><a href="/designs">Designs List</a></li>
            <li className="list-group-item"><a href="/documents">Document Library</a></li>
            <li className="list-group-item"><a href="/activities">Activities</a></li>
            <li className="list-group-item"><a href="/customer">Customers</a></li>
            <li className="list-group-item"><a href="/products/analytics">Products analytics</a></li>
            {isAdmin && <li className="list-group-item"><a href="/admin-dashboard">Admin Dashboard</a></li>}
            <button onClick={handleSalesforceLogin}>Login with Salesforce</button>
            <button onClick={handleCheckAccessToken}>Check Access Token</button>
          </ul>
        </div>
        <div className="col-md-8">
          <UserActivityList />
          {isSuccess && accessTokenData && <div>Access Token: {accessTokenData.accessToken}</div>}
          {isError && <div>Error: {error?.data?.message || 'Failed to retrieve access token'}</div>}
        </div>
      </div>
      {id && (
        <UserTasks userId={id}/>
      )}
    </div>
  )
}

export default Home;
