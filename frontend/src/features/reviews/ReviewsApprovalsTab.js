import { useGetReviewsByItemReviewedQuery } from './reviewsApiSlice';

const ReviewsApprovalsTab = ({ projectId }) => {
    const {
        data: reviewsData,
        isLoading,
        isError,
        error,
    } = useGetReviewsByItemReviewedQuery(projectId);

    console.log(reviewsData);
    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>Error: {error?.data?.message}</div>;

    // Only include reviews where reviewType is 'Update'
    const filteredReviews = reviewsData.ids
        .map(id => reviewsData.entities[id])
        .filter(review => review.reviewType === 'Update');

    return (
        <>
            <div className="reviews-approvals">
                <h3>Change Request Reviews</h3>
                {filteredReviews.length > 0 ? (
                    filteredReviews.map((review, index) => (
                        <div key={index} className="change-request-review">
                            <h4>{`Change Request: ${review.itemReviewed} (${review.id})`}</h4>
                            <p>Status: <strong>{review.status}</strong></p>
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Reviewer</th>
                                        <th>Role</th>
                                        <th>Review Date</th>
                                        <th>Feedback</th>
                                        <th>Decision</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {review.reviewers.map((reviewer, idx) => (
                                        <tr key={idx}>
                                            <td>{`${reviewer.userId.firstName} ${reviewer.userId.surname}`}</td>
                                            <td>{reviewer.userId.role || 'Reviewer'}</td>
                                            <td>{new Date(reviewer.reviewDate).toLocaleDateString()}</td>
                                            <td>{reviewer.feedback}</td>
                                            <td>{reviewer.decision}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ))
                ) : (
                    <p>No change request reviews available.</p>
                )}
            </div>
        </>
    );
};

export default ReviewsApprovalsTab;
