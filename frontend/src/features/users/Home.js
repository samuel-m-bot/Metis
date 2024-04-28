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
          <div className="list-group">
            <a href="/projects" className="list-group-item list-group-item-action">Projects Dashboard</a>
            <a href="/products" className="list-group-item list-group-item-action">Products List</a>
            <a href="/designs" className="list-group-item list-group-item-action">Designs List</a>
            <a href="/documents" className="list-group-item list-group-item-action">Document Library</a>
            <a href="/activities" className="list-group-item list-group-item-action">Activities</a>
            <a href="/customer" className="list-group-item list-group-item-action">Customers</a>
            <a href="/products/analytics" className="list-group-item list-group-item-action">Products analytics</a>
            {isAdmin && <a href="/admin-dashboard" className="list-group-item list-group-item-action">Admin Dashboard</a>}
          </div>
          <div className="mt-3">
            <button onClick={handleSalesforceLogin} className="btn btn-primary me-2 mb-2">Login with Salesforce</button>
            {/* <button onClick={handleCheckAccessToken} className="btn btn-secondary">Check Access Token</button> */}
          </div>
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
