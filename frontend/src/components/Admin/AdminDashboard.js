import React from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css'; 

const AdminDashboard = () => {
    const navigate = useNavigate();
    const models = [
        { name: 'Users', route: '/admin-dashboard/users' },
        { name: 'Tasks', route: '/admin-dashboard/tasks' },
        { name: 'Projects', route: '/admin-dashboard/projects' },
        { name: 'Products', route: '/admin-dashboard/products' },
        { name: 'Documents', route: '/admin-dashboard/documents' },
        { name: 'Designs', route: '/admin-dashboard/designs' },
        { name: 'Change Requests', route: '/admin-dashboard/change-requests' },
        { name: 'Activities', route: '/admin-dashboard/activities' },
        { name: 'Reviews', route: '/admin-dashboard/reviews' }
    ];

    const handleModelClick = (route) => {
        navigate(route);
    };

    return (
        <div className="admin-dashboard">
            <h1 className="dashboard-title">Admin Dashboard</h1>
            <div className="model-grid">
                {models.map((model, index) => (
                    <button
                        key={index}
                        onClick={() => handleModelClick(model.route)}
                        className="model-button"
                    >
                        {model.name}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default AdminDashboard;
