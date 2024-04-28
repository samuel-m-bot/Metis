const ActivityList = ({ activities, onPageChange, currentPage, totalPages }) => {
    return (
        <>
        <div className="table-responsive">
            <table className="table table-hover">
                <thead>
                    <tr>
                        <th>Type</th>
                        <th>Description</th>
                        <th>Created By</th>
                        <th>Timestamp</th>
                    </tr>
                </thead>
                <tbody>
                    {activities.map(activity => (
                        <tr key={activity.id}>
                            <td><strong>{activity.actionType}</strong></td>
                            <td>{activity.description}</td>
                            <td>
                            {activity.createdBy ? 
                                (activity.createdBy.firstName && activity.createdBy.surname ? 
                                `${activity.createdBy.firstName} ${activity.createdBy.surname}` : 
                                activity.createdBy) : 
                                'No User'}
                            </td>
                            <td>{new Date(activity.timestamp).toLocaleString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {totalPages > 1 && (
                <nav aria-label="Activity pagination">
                    <ul className="pagination">
                        {[...Array(totalPages).keys()].map(page => (
                            <li key={page + 1} className={`page-item ${currentPage === page + 1 ? 'active' : ''}`}>
                                <button className="page-link" onClick={() => onPageChange(page + 1)}>
                                    {page + 1}
                                </button>
                            </li>
                        ))}
                    </ul>
                </nav>
            )}
        </div>
        </>
    );
};

export default ActivityList;
