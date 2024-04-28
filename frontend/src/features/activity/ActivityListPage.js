import { useState } from 'react';
import ActivityList from './ActivityList';
import { useGetAllActivitiesQuery } from './activityApiSlice';

const ActivityListPage = () => {
    const [page, setPage] = useState(1);
    const {
        data: activityData,
        isLoading,
        isError,
        error
    } = useGetAllActivitiesQuery({ page }, {
        pollingInterval: 120000,
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true
    });

    console.log(activityData)
    const activities = activityData ? activityData.ids.map(id => activityData.entities[id]) : [];
    const totalPages = activityData ? activityData.totalPages : 0;

    return (
        <div className="container mt-3">
            <h3>All Activities</h3>
            {isLoading && <div className="alert alert-info" role="alert">Loading activities...</div>}
            {isError && <div className="alert alert-danger" role="alert">
                Error loading activities: {error?.data?.message || "Unknown error"}
            </div>}
            {!isLoading && activities.length === 0 && !isError && (
                <div className="alert alert-warning" role="alert">
                    No activities found.
                </div>
            )}
            {activities.length > 0 && (
                <ActivityList 
                    activities={activities}
                    onPageChange={setPage}
                    currentPage={page}
                    totalPages={totalPages}
                />
            )}
        </div>
    );
};

export default ActivityListPage;
