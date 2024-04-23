import React from 'react';
import { useNavigate } from 'react-router-dom';

const ReviewSuccessPage = () => {
    const navigate = useNavigate();

    return (
        <div className="container mt-5">
            <h1>Review Submitted Successfully!</h1>
            <p>Your review has been successfully submitted and is now being processed.</p>
            <div>
                <button className="btn btn-primary" onClick={() => navigate('/home')}>
                    Return to home page
                </button>
            </div>
        </div>
    );
};

export default ReviewSuccessPage;
