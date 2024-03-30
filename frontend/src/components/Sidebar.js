import './Sidebar.css';
import { FaTimes } from 'react-icons/fa'; 
import { Link } from 'react-router-dom';


const Sidebar = ({ isOpen, closeSidebar }) => {
    const handleIconClick = (e) => {
        e.stopPropagation();
        closeSidebar();
    };
    return (
        <div className={`sidebar ${isOpen ? 'open' : ''}`}>
            <div className="sidebar-header">
                <FaTimes className="close-icon" onClick={handleIconClick} />
            </div>
            <div className="sidebar-content">
                <Link to="/change-requests" className="sidebar-item" onClick={closeSidebar}>My Change Requests</Link>
                <Link to="/my-tasks" className="sidebar-item" onClick={closeSidebar}>My Tasks</Link>
                <Link to="/activity" className="sidebar-item" onClick={closeSidebar}>Activity</Link>
                <Link to="/user-settings" className="sidebar-item" onClick={closeSidebar}>User Settings</Link>
                <Link to="/support" className="sidebar-item" onClick={closeSidebar}>Support</Link>
            </div>
        </div>
    );
};

export default Sidebar;
