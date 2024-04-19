import './Sidebar.css';
import { FaTimes } from 'react-icons/fa'; 
import { Link } from 'react-router-dom';
import { useSendLogoutMutation } from '../features/auth/authApiSlice';
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ isOpen, closeSidebar }) => {
    const [sendLogout, { isLoading, isError, error }] = useSendLogoutMutation();
    const navigate = useNavigate()

    const handleLogout = async () => {
        // Call the mutation function to send the logout request
        sendLogout().catch((error) => {
            console.error('Logout failed:', error);
        });
        navigate('/')
    };

    const handleIconClick = (e) => {
        e.stopPropagation();
        closeSidebar();
    };

    if(isError) (<p>An error has ocurred logging out: {error?.data.message}</p>)
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
                <button onClick={handleLogout} disabled={isLoading}>
                    {isLoading ? 'Logging Out...' : 'Log Out'}
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
