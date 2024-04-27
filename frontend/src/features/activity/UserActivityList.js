import React, { useState } from 'react';
import ActivityList from './ActivityList';
import { useGetActivityByUserQuery } from './activityApiSlice';
import useAuth from '../../hooks/useAuth';

const UserActivityList = () => {
    const [page, setPage] = useState(1);
    const { id, firstName, surname } = useAuth();
    const {
        data: activityData,
        isLoading,
        isError,
        error
    } = useGetActivityByUserQuery({ userId: id, page }, {
        refetchOnMountOrArgChange: true
    });

    const activities = activityData ? activityData.ids.map(id => activityData.entities[id]) : [];
    const totalPages = activityData ? activityData.totalPages : 0;

    return (
        <div className="container mt-3">
            <h3>Activities for {firstName} {surname}</h3>
            {isLoading && <div className="alert alert-info" role="alert">Loading activities...</div>}
            {isError && <div className="alert alert-danger" role="alert">
                Error loading activities: {error?.data?.message || "Unknown error"}
            </div>}
            {!isLoading && activities.length === 0 && !isError && (
                <div className="alert alert-warning" role="alert">
                    No activities found for {firstName} {surname}.
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
export default UserActivityList;
