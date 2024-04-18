import {
    createSelector,
    createEntityAdapter
} from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";

const designsAdapter = createEntityAdapter({})

const initialState = designsAdapter.getInitialState()

export const designsApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getDesigns: builder.query({
            query: () => ({
                url: '/designs',
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError
                },
            }),
            transformResponse: responseData => {
                const loadedDesigns = responseData.map(design => {
                    design.id = design._id
                    return design
                });
                return designsAdapter.setAll(initialState, loadedDesigns)
            },
            providesTags: (result, error, arg) => {
                if (result?.ids) {
                    return [
                        { type: 'Design', id: 'LIST' },
                        ...result.ids.map(id => ({ type: 'Design', id }))
                    ]
                } else return [{ type: 'Design', id: 'LIST' }]
            }
        }),
        addNewDesign: builder.mutation({
            query: (designData) => {
                return {
                    url: '/designs',
                    method: 'POST',
                    body: designData.formData,
                };
            },
            invalidatesTags: [
                { type: 'Design', id: "LIST" }
            ]
        }),
        updateDesign: builder.mutation({
            query: (designData) => ({
                url: `/designs/${designData.id}`, 
                method: 'PATCH',
                body: designData.formData
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'Design', id: arg.id },
                { type: 'Design', id: "LIST" }
            ]
        }),        
        deleteDesign: builder.mutation({
            query: ({ id }) => ({
                url: `/designs/${id}`,
                method: 'DELETE',
                body: { id }
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'Design', id: arg.id }
            ]
        }),
        downloadDesign: builder.query({
            query: (designId) => ({
              url: `/designs/download/${designId}`,
              method: 'GET',
              responseHandler: (response) => response.blob(),
            }),
        }),
        getDesignsByProjectId: builder.query({
            query: projectId => ({
                url: `/designs/project/${projectId}`,
                method: 'GET'
            }),
            transformResponse: responseData => {
                const loadedDesigns = responseData.map(design => {
                    design.id = design._id;
                    return design;
                });
                return designsAdapter.setAll(initialState, loadedDesigns);
            },
            providesTags: (result, error, arg) => {
                if (result?.ids) {
                    return [
                        { type: 'Design', id: 'LIST' },
                        ...result.ids.map(id => ({ type: 'Design', id }))
                    ]
                } else return [{ type: 'Design', id: 'LIST' }];
            }
        }),
    }),
})

export const {
    useGetDesignsQuery,
    useAddNewDesignMutation,
    useUpdateDesignMutation,
    useDeleteDesignMutation,
    useDownloadDesignQuery,
    useLazyDownloadDesignQuery,
    useGetDesignsByProjectIdQuery,
    useLazyGetDesignsQuery
} = designsApiSlice

// returns the query result object
export const selectDesignsResult = designsApiSlice.endpoints.getDesigns.select()

// creates memoized selector
const selectDesignsData = createSelector(
    selectDesignsResult,
    designsResult => designsResult.data // normalized state object with ids & entities
)

//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
    selectAll: selectAllDesigns,
    selectById: selectDesignById,
    selectIds: selectDesignIds
    // Pass in a selector that returns the designs slice of state
} = designsAdapter.getSelectors(state => selectDesignsData(state) ?? initialState)