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
        getChangeRequestById: builder.query({
            query: (id) => ({
                url: `/changeRequests/${id}`,
                method: 'GET'
            }),
            transformResponse: responseData => {
                const changeRequest = { ...responseData, id: responseData._id };
                return changeRequest;
            },
            providesTags: (result, error, arg) => [{ type: 'ChangeRequest', id: result.id }]
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
        getChangeRequestsByRelatedItem: builder.query({
            query: ({ type, itemId }) => `/changeRequests/${type}/${itemId}`,
            providesTags: (result, error, arg) => [{ type: 'ChangeRequest', id: 'LIST' }]
        }),
        getChangeRequestsByMainItem: builder.query({
            query: (mainItemId) => `/changeRequests/main-item/${mainItemId}`,
            providesTags: (result, error, mainItemId) => [{ type: 'ChangeRequest', mainItemId: mainItemId }],
        }),
        addCommentToChangeRequest: builder.mutation({
            query: (commentData) => ({
                url: `/changeRequests/${commentData.changeRequestId}/comment`,
                method: 'POST',
                body: commentData,
            }),
            invalidatesTags: (result, error, { changeRequestId }) => [{ type: 'Comments', id: changeRequestId }]
        }),
        deleteCommentFromChangeRequest: builder.mutation({
            query: ({ changeRequestId, commentId }) => ({
                url: `/changeRequests/${changeRequestId}/comment/${commentId}`,
                method: 'DELETE',
            }),
            invalidatesTags: (result, error, { changeRequestId }) => [{ type: 'Comments', id: changeRequestId }]
        }),        
        getCommentsForChangeRequest: builder.query({
            query: (changeRequestId) => `/changeRequests/${changeRequestId}/comments`,
            transformResponse: (response, meta, arg) => response.sort((a, b) => new Date(b.postedDate) - new Date(a.postedDate)),
            providesTags: (result, error, changeRequestId) => [{ type: 'Comments', id: changeRequestId }],
        }),
    }),
})

export const {
    useGetChangeRequestsQuery,
    useGetChangeRequestByIdQuery,
    useLazyGetChangeRequestByIdQuery,
    useAddNewChangeRequestMutation,
    useUpdateChangeRequestMutation,
    useDeleteChangeRequestMutation,
    useLazyGetChangeRequestsQuery,
    useGetChangeRequestsByProjectAndStatusQuery,
    useGetChangeRequestsByRelatedItemQuery,
    useGetChangeRequestsByMainItemQuery,
    useLazyGetChangeRequestsByMainItemQuery,
    useAddCommentToChangeRequestMutation,
    useDeleteCommentFromChangeRequestMutation,
    useGetCommentsForChangeRequestQuery
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