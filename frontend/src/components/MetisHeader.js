import logo from '../img/metis-logo-no-background.png';
import { FaUserCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const MetisHeader = ({ toggleSidebar }) => {
    const navigate = useNavigate();

    return (
        <nav className="navbar bg-body-tertiary">
            <div className="container-fluid">
                <a className="navbar-brand" onClick={(e) => {
                    e.preventDefault();
                    navigate('/home');
                }}>
                    <img src={logo} alt="Logo" width="50" height="32" className="d-inline-block align-text-top" />
                </a>
                <div onClick={toggleSidebar} style={{ cursor: 'pointer' }}>
                    <FaUserCircle size={32} />
                </div>
            </div>
        </nav>
    );
};

export default MetisHeader;
