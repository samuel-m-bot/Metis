import { useGetDesignsByProjectIdQuery } from './designsApiSlice';
import ApprovalStatusPieChart from '../../components/ApprovalStatusPieChart';
import FeaturedDesigns from '../../components/FeaturedDesigns';
import { useNavigate } from 'react-router-dom';

const DesignTab = ({ projectId }) => {
    const navigate = useNavigate()
    const {
        data: designs,
        isLoading,
        isError,
        error
    } = useGetDesignsByProjectIdQuery(projectId);

    if (isLoading) return <p>Loading designs...</p>;
    if (isError) return <p>Error loading designs: {error.message}</p>;

    const designList = designs.ids.map(id => designs.entities[id]);

    const handleDesignClicked = (designId) => {
        navigate(`/designs/${designId}`);
    };

    const handleViewAllDesignClicked = () => {
        navigate(`designs/`);
    };

    return (
        <div className="design-tab-content">
            <h2>Project Design Overview</h2>
            <p>Here's a brief overview of the current design phase, including key objectives and recent updates.</p>

            <button 
                onClick={() => handleViewAllDesignClicked()} 
                className="btn btn-primary">
                View Design List for Project
            </button>

            <div className="design-updates">
                <h3>Latest Design Updates</h3>
                {designList.map((design, index) => (
                    <div key={index} className="design-update-item">
                        <h5 onClick={() => handleDesignClicked(design._id)}>{design.name}</h5>
                        <p>Description: {design.description}</p>
                        <p>Type: {design.type}</p>
                        <p>Status: <span className={`badge ${design.status === 'Approved' ? 'bg-success' : design.status === 'Draft' ? 'bg-primary' : 'bg-warning'}`}>{design.status}</span></p>
                    </div>
                ))}
            </div>

            <div className="design-approval-status">
                <h3>Design Approval Status</h3>
                <div style={{ width: '400px', height: '400px' }}>
                    <ApprovalStatusPieChart designs={designList} />
                </div>
            </div>

            <FeaturedDesigns designs={designList.filter(design => design.isFeatured)} />

            <div className="design-actions mb-4">
                <button className="btn btn-primary me-2" onClick={() => console.log('Add new design')}>Add New Design</button>
                <button className="btn btn-secondary" onClick={() => console.log('View all designs')}>View All Designs</button>
            </div>
        </div>
    );
};

export default DesignTab;
