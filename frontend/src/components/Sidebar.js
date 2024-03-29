import './Sidebar.css'

const Sidebar = ({ isOpen, closeSidebar }) => {
    return (
        <div className={`sidebar ${isOpen ? 'open' : ''}`} onClick={closeSidebar}>
            <p>Sidebar Content</p>
        </div>
    );
};

export default Sidebar;
