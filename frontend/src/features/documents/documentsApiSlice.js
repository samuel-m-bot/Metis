import {
    createSelector,
    createEntityAdapter
} from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";

const documentsAdapter = createEntityAdapter({})

const initialState = documentsAdapter.getInitialState()

export const documentsApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getDocuments: builder.query({
            query: () => ({
                url: '/documents',
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError
                },
            }),
            transformResponse: responseData => {
                const loadedDocuments = responseData.map(document => {
                    document.id = document._id
                    return document
                });
                return documentsAdapter.setAll(initialState, loadedDocuments)
            },
            providesTags: (result, error, arg) => {
                if (result?.ids) {
                    return [
                        { type: 'Document', id: 'LIST' },
                        ...result.ids.map(id => ({ type: 'Document', id }))
                    ]
                } else return [{ type: 'Document', id: 'LIST' }]
            }
        }),
        addNewDocument: builder.mutation({
            query: (documentData) => {
                return {
                    url: '/documents',
                    method: 'POST',
                    body: documentData.formData,
                };
            },
            invalidatesTags: [
                { type: 'Document', id: "LIST" }
            ]
        }),
        updateDocument: builder.mutation({
            query: (documentData) => ({
                url: `/documents/${documentData.id}`, 
                method: 'PATCH',
                body: documentData.formData
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'Document', id: arg.id },
                { type: 'Document', id: "LIST" }
            ]
        }),        
        deleteDocument: builder.mutation({
            query: ({ id }) => ({
                url: `/documents/${id}`,
                method: 'DELETE',
                body: { id }
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'Document', id: arg.id }
            ]
        }),
        downloadDocument: builder.query({
            query: documentId => ({
                url: `/documents/download/${documentId}`,
                method: 'GET',
                responseHandler: (response) => response.blob() 
            }),
            transformResponse: (blob, meta) => {
                console.log('Blob Size in Transform:', blob.size);  
                console.log('Blob Type in Transform:', blob.type); 

                if (!(blob instanceof Blob)) {
                    console.error('Expected a Blob but received:', typeof blob);
                    throw new Error('The received data is not a Blob.');
                }

                const contentDisposition = meta.response.headers.get('content-disposition');
                let filename = "default_filename"; 
                if (contentDisposition) {
                    console.log("Has contentDisposition");
                    const filenameMatch = /filename="?(.+)"?/.exec(contentDisposition);
                    if (filenameMatch && filenameMatch[1]) {
                        filename = filenameMatch[1].replace(/['"]/g, '');
                    }
                }
                return { blob, filename };
            },
        }),
        getDocumentsByProjectId: builder.query({
            query: projectId => ({
                url: `/documents/project/${projectId}`,
                method: 'GET'
            }),
            transformResponse: responseData => {
                const loadedDocuments = responseData.map(document => {
                    document.id = document._id;
                    return document;
                });
                return documentsAdapter.setAll(initialState, loadedDocuments);
            },
            providesTags: (result, error, arg) => {
                if (result?.ids) {
                    return [
                        { type: 'Document', id: 'LIST' },
                        ...result.ids.map(id => ({ type: 'Document', id }))
                    ]
                } else return [{ type: 'Document', id: 'LIST' }];
            }
        }),
    }),
})

export const {
    useGetDocumentsQuery,
    useAddNewDocumentMutation,
    useUpdateDocumentMutation,
    useDeleteDocumentMutation,
    useDownloadDocumentQuery,
    useLazyDownloadDocumentQuery,
    useGetDocumentsByProjectIdQuery,
    useLazyGetDocumentsQuery
} = documentsApiSlice

// returns the query result object
export const selectDocumentsResult = documentsApiSlice.endpoints.getDocuments.select()

// creates memoized selector
const selectDocumentsData = createSelector(
    selectDocumentsResult,
    documentsResult => documentsResult.data // normalized state object with ids & entities
)

//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
    selectAll: selectAllDocuments,
    selectById: selectDocumentById,
    selectIds: selectDocumentIds
    // Pass in a selector that returns the documents slice of state
} = documentsAdapter.getSelectors(state => selectDocumentsData(state) ?? initialState)