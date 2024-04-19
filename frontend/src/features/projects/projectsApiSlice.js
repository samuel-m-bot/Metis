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
        getProjectTeamMembers: builder.query({
            query: projectId => `/projects/${projectId}/TeaMember`,
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
    }),
});

export const {
    useGetProjectsQuery,
    useGetProjectTeamMembersQuery,
    useAddNewProjectMutation,
    useUpdateProjectMutation,
    useDeleteProjectMutation,
    useAddTeamMemberMutation,
    useRemoveTeamMemberMutation
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
