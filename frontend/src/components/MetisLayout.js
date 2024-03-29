// Import necessary hooks and components at the top
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import MetisHeader from './MetisHeader';
import Breadcrumbs from './Breadcrumbs';
import Sidebar from './Sidebar';
import './MetisLayout.css';

const MetisLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    return (
        <div className='metis-layout'>
            <MetisHeader toggleSidebar={toggleSidebar} />
            <div className={`layout-container ${isSidebarOpen ? 'sidebar-open' : ''}`}>
                <Sidebar isOpen={isSidebarOpen} closeSidebar={() => setIsSidebarOpen(false)} />
                <div className='content-container'>
                    <Breadcrumbs />
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default MetisLayout;
