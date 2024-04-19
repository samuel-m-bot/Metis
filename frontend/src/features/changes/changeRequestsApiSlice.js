import {
    createSelector,
    createEntityAdapter
} from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";

const changeRequestsAdapter = createEntityAdapter({})

const initialState = changeRequestsAdapter.getInitialState()

export const changeRequestsApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getChangeRequests: builder.query({
            query: () => ({
                url: '/changeRequests',
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError
                },
            }),
            transformResponse: responseData => {
                const loadedChangeRequests = responseData.map(changeRequest => {
                    changeRequest.id = changeRequest._id
                    return changeRequest
                });
                return changeRequestsAdapter.setAll(initialState, loadedChangeRequests)
            },
            providesTags: (result, error, arg) => {
                if (result?.ids) {
                    return [
                        { type: 'ChangeRequest', id: 'LIST' },
                        ...result.ids.map(id => ({ type: 'ChangeRequest', id }))
                    ]
                } else return [{ type: 'ChangeRequest', id: 'LIST' }]
            }
        }),
        addNewChangeRequest: builder.mutation({
            query: initialChangeRequestData => ({
                url: '/changeRequests',
                method: 'POST',
                body: {
                    ...initialChangeRequestData,
                }
            }),
            invalidatesTags: [
                { type: 'ChangeRequest', id: "LIST" }
            ]
        }),
        updateChangeRequest: builder.mutation({
            query: changeRequestData => ({
                url: `/changeRequests/${changeRequestData.id}`,
                method: 'PATCH',
                body: changeRequestData
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'ChangeRequest', id: arg.id },
                { type: 'ChangeRequest', id: "LIST" }
            ]
        }),
        deleteChangeRequest: builder.mutation({
            query: ({ id }) => ({
                url: `/changeRequests/${id}`,
                method: 'DELETE',
                body: { id }
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'ChangeRequest', id: arg.id }
            ]
        }),
        getChangeRequestsByProjectAndStatus: builder.query({
            query: ({ projectId, status }) => `/changeRequests/project/${projectId}/${status}`,
            providesTags: (result, error, arg) => [{ type: 'ChangeRequest', id: 'LIST' }]
        }),
    }),
})

export const {
    useGetChangeRequestsQuery,
    useAddNewChangeRequestMutation,
    useUpdateChangeRequestMutation,
    useDeleteChangeRequestMutation,
    useLazyGetChangeRequestsQuery,
    useGetChangeRequestsByProjectAndStatusQuery
} = changeRequestsApiSlice

// returns the query result object
export const selectChangeRequestsResult = changeRequestsApiSlice.endpoints.getChangeRequests.select()

// creates memoized selector
const selectChangeRequestsData = createSelector(
    selectChangeRequestsResult,
    changeRequestsResult => changeRequestsResult.data // normalized state object with ids & entities
)

//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
    selectAll: selectAllChangeRequests,
    selectById: selectChangeRequestById,
    selectIds: selectChangeRequestIds
    // Pass in a selector that returns the changeRequests slice of state
} = changeRequestsAdapter.getSelectors(state => selectChangeRequestsData(state) ?? initialState)