import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from 'react-router-dom';

const Review = ({ review, canEdit }) => {
    const navigate = useNavigate();

    const handleEdit = () => navigate(`/admin-dashboard/reviews/${review.id}`);
    const handleViewReview = () => {
        navigate(`/reviews/${review.id}`, { state: { review } });
    };

    return (
        <tr>
            <td>{review.id}</td>
            <td>{review.onModel}</td>
            <td>{review.status}</td>
            <td>{new Date(review.initiationDate).toLocaleDateString()}</td>
            <td>
                {canEdit && (
                    <button className="btn btn-info" onClick={handleEdit}>
                        <FontAwesomeIcon icon={faPenToSquare} />
                    </button>
                )}
                <button onClick={handleViewReview} className="btn btn-info">View Details</button>
            </td>
        </tr>
    );
};

export default Review;