import { useNavigate } from "react-router-dom";
import designIcon from '../img/designIcon.jpg'

const FeaturedDesigns = ({ designs }) => {
    const navigate = useNavigate();

    const handleDesignClicked = (designId) => {
        navigate(`/designs/${designId}`);
    };

    return (
        <div className="featured-designs">
            <h3>Featured Designs</h3>
            <div className="row">
                {designs.map(design => (
                    <div key={design._id} className="col-md-4 mb-4">
                        <div className="card">
                            <img src={designIcon} className="card-img-top" alt={design.name} />
                            <div className="card-body">
                                <h5 className="card-title">{design.name}</h5>
                                <p className="card-text">{design.description}</p>
                                <button onClick={() => handleDesignClicked(design._id)} className="btn btn-primary">View Design</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FeaturedDesigns;
