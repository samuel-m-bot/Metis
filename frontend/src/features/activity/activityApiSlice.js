import {
    createEntityAdapter,
    createSelector
} from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";

const activityAdapter = createEntityAdapter({});

const initialState = activityAdapter.getInitialState({
    // Add pagination data to initial state if needed
    currentPage: 1,
    totalPages: 1,
    totalActivities: 0
});
export const activityApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getAllActivities: builder.query({
            query: (args = {}) => ({
                url: '/activities',
                params: args,
            }),
            transformResponse: (responseData, meta, arg) => {
                const loadedActivities = responseData.activities.map(activity => ({
                    ...activity,
                    id: activity._id
                }));
                // Ensure that we return an object that includes both the entities and additional properties
                return {
                    ...activityAdapter.setAll(initialState, loadedActivities),
                    totalPages: responseData.totalPages,
                    totalActivities: responseData.totalActivities
                };
            },            
            providesTags: (result, error, arg) => {
                if (result?.ids) {
                    return [
                        { type: 'Activity', id: 'LIST' },
                        ...result.ids.map(id => ({ type: 'Activity', id }))
                    ]
                } else return [{ type: 'Activity', id: 'LIST' }]
            }
        }),
        getActivityByUser: builder.query({
            query: ({userId}) => ({
                url: `/activities/user/${userId}`,
            }),
            transformResponse: responseData => {
                const loadedActivities = responseData.map(activity => ({
                    ...activity,
                    id: activity._id
                }));
                return activityAdapter.setAll(initialState, loadedActivities);
            },
            providesTags: (result, error, arg) => result ? [{ type: 'Activity', id: result.id }] : [],
        }),
        getActivitiesByRelatedToAndModel: builder.query({
            query: ({ relatedTo, onModel }) => ({
                url: `/activities/by-context`,
                params: { relatedTo, onModel }
            }),
            transformResponse: responseData => {
                const loadedActivities = responseData.map(activity => ({
                    ...activity,
                    id: activity._id
                }));
                return activityAdapter.setAll(initialState, loadedActivities);
            },
            providesTags: (result, error, arg) => result ? [{ type: 'Activity', id: result.id }] : [],
        }),
        getLatestRevisionActivity: builder.query({
            query: ({ relatedTo, onModel }) => ({
                url: '/activities/revision/latest',
                params: { relatedTo, onModel }
            }),
            transformResponse: responseData => ({
                ...responseData,
                id: responseData._id
            }),
            providesTags: (result, error, arg) => result ? [{ type: 'Activity', id: result.id }] : [],
        }),
        updateActivity: builder.mutation({
            query: ({ id, data }) => ({
                url: `/activities/${id}`,
                method: 'PATCH',
                body: data
            }),
            invalidatesTags: [{ type: 'Activity', id: "LIST" }],
        }),
        deleteActivity: builder.mutation({
            query: (id) => ({
                url: `/activities/${id}`,
                method: 'DELETE'
            }),
            invalidatesTags: (result, error, arg) => [{ type: 'Activity', id: arg.id }],
        }),
    }),
})

export const {
    useGetAllActivitiesQuery,
    useGetActivityByUserQuery,
    useGetActivitiesByRelatedToAndModelQuery,
    useGetLatestRevisionActivityQuery,
    useUpdateActivityMutation,
    useDeleteActivityMutation,
} = activityApiSlice

const selectActivityResult = activityApiSlice.endpoints.getAllActivities.select()
const selectActivityData = createSelector(
    selectActivityResult,
    activityResult => activityResult.data
)

export const {
    selectAll: selectAllActivities,
    selectById: selectActivityById,
    selectIds: selectActivityIds
} = activityAdapter.getSelectors(state => selectActivityData(state) ?? initialState)
