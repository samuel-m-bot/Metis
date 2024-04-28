import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";

const projectsAdapter = createEntityAdapter({});

const initialState = projectsAdapter.getInitialState();

export const projectsApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getProjects: builder.query({
            query: () => '/projects',
            transformResponse: responseData => {
                const loadedProjects = responseData.map(project => ({
                    ...project,
                    id: project._id
                }));
                return projectsAdapter.setAll(initialState, loadedProjects);
            },
            providesTags: (result, error, arg) => result?.ids ? result.ids.map(id => ({ type: 'Project', id })) : [{ type: 'Project', id: 'LIST' }]
        }),
        getProjectById: builder.query({
            query: (id) => ({
                url: `/projects/${id}`,
                method: 'GET'
            }),
            transformResponse: responseData => {
                const project = { ...responseData, id: responseData._id };
                return project;
            },
            providesTags: (result, error, arg) => [{ type: 'Project', id: result.id }]
        }),
        getAssignedProjects: builder.query({
            query: (userId) => `/projects/assigned/${userId}`,
            transformResponse: responseData => {
                const assignedProjects = responseData.map(project => ({
                    ...project,
                    id: project._id, 
                }));
                return projectsAdapter.setAll(initialState, assignedProjects);
            },
            providesTags: (result, error, arg) => result?.ids ? result.ids.map(id => ({ type: 'Project', id })) : [{ type: 'Project', id: 'LIST' }]
        }),
        getProjectTeamMembers: builder.query({
            query: projectId => `/projects/${projectId}/TeaMember`,
            providesTags: (result, error, arg) => [{ type: 'Project', id: arg }]
        }),
        getProjectReviewers: builder.query({
            query: projectId => `/projects/${projectId}/reviewers`,
            providesTags: (result, error, arg) => [{ type: 'Project', id: arg }]
        }),
        addNewProject: builder.mutation({
            query: initialProjectData => ({
                url: '/projects',
                method: 'POST',
                body: initialProjectData,
            }),
            invalidatesTags: [{ type: 'Project', id: "LIST" }]
        }),
        updateProject: builder.mutation({
            query: projectData => ({
                url: `/projects/${projectData.id}`,
                method: 'PATCH',
                body: projectData
            }),
            invalidatesTags: (result, error, arg) => [{ type: 'Project', id: arg.id }, { type: 'Project', id: "LIST" }]
        }),
        deleteProject: builder.mutation({
            query: ({ id }) => ({
                url: `/projects/${id}`,
                method: 'DELETE'
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'Project', id: arg.id }
            ]
        }),
        addTeamMember: builder.mutation({
            query: ({ projectId, userId, role, permissions }) => ({
                url: `/projects/${projectId}/addTeamMember`,
                method: 'PATCH',
                body: { userId, role, permissions }
            }),
            invalidatesTags: (result, error, arg) => [{ type: 'Project', id: arg.projectId }]
        }),
        removeTeamMember: builder.mutation({
            query: ({ projectId, teamMemberId }) => ({
                url: `/projects/${projectId}/removeTeamMember`,
                method: 'PATCH',
                body: { teamMemberId }
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'Project', id: arg.projectId }
            ],
        }),
        getUserPermissions: builder.query({
            query: (projectId) => `/projects/${projectId}/my-permissions`, 
            transformResponse: responseData => {
                return {
                    ...responseData,
                    id: responseData.projectId 
                };
            },
            providesTags: (result, error, arg) => [{ type: 'Permission', id: result ? result.id : 'LIST' }]
        }), 
        getSalesforceCustomer: builder.query({
            query: (projectId) => ({
                url: `/projects/${projectId}/customer`,
                method: 'GET'
            }),
            providesTags: (result, error, arg) => [{ type: 'Project', id: arg }]
        }),
        updateProjectCustomer: builder.mutation({
            query: ({ projectId, customerId }) => ({
                url: `/projects/${projectId}/customer/add`,
                method: 'PATCH',
                body: { customerId }
            }),
            invalidatesTags: (result, error, arg) => [{ type: 'Project', id: arg.projectId }]
        }),              
    }),
});

export const {
    useGetProjectsQuery,
    useGetProjectByIdQuery,
    useGetAssignedProjectsQuery,
    useGetProjectTeamMembersQuery,
    useGetProjectReviewersQuery,
    useAddNewProjectMutation,
    useUpdateProjectMutation,
    useDeleteProjectMutation,
    useAddTeamMemberMutation,
    useRemoveTeamMemberMutation,
    useGetUserPermissionsQuery,
    useGetSalesforceCustomerQuery,
    useUpdateProjectCustomerMutation
} = projectsApiSlice;

// Selectors
export const selectProjectsResult = projectsApiSlice.endpoints.getProjects.select();
const selectProjectsData = createSelector(
    selectProjectsResult,
    projectsResult => projectsResult.data // normalized state object with ids & entities
);
export const {
    selectAll: selectAllProjects,
    selectById: selectProjectById,
    selectIds: selectProjectIds
} = projectsAdapter.getSelectors(state => selectProjectsData(state) ?? initialState);
