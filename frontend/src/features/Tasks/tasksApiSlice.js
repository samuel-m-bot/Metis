import {
    createSelector,
    createEntityAdapter
} from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";

const tasksAdapter = createEntityAdapter({})

const initialState = tasksAdapter.getInitialState()

export const tasksApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getTasks: builder.query({
            query: () => ({
                url: '/tasks',
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError
                },
            }),
            transformResponse: responseData => {
                const loadedTasks = responseData.map(task => {
                    task.id = task._id
                    return task
                });
                return tasksAdapter.setAll(initialState, loadedTasks)
            },
            providesTags: (result, error, arg) => {
                if (result?.ids) {
                    return [
                        { type: 'Task', id: 'LIST' },
                        ...result.ids.map(id => ({ type: 'Task', id }))
                    ]
                } else return [{ type: 'Task', id: 'LIST' }]
            }
        }),
        getTaskById: builder.query({
            query: (taskId) => `/tasks/${taskId}`,
            transformResponse: responseData => {
                responseData.id = responseData._id;
                return responseData;
            },
            providesTags: (result, error, arg) => [
                { type: 'Task', id: result?.id }
            ]
        }),        
        addNewTask: builder.mutation({
            query: initialTaskData => ({
                url: '/tasks',
                method: 'POST',
                body: {
                    ...initialTaskData,
                }
            }),
            invalidatesTags: [
                { type: 'Task', id: "LIST" }
            ]
        }),
        updateTask: builder.mutation({
            query: taskData => ({
                url: `/tasks/${taskData.id}`,
                method: 'PATCH',
                body: taskData
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'Task', id: arg.id },
                { type: 'Task', id: "LIST" }
            ]
        }),      
        deleteTask: builder.mutation({
            query: ({ id }) => ({
                url: `/tasks/${id}`,
                method: 'DELETE',
                body: { id }
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'Task', id: arg.id }
            ]
        }),
        filterTasksByStatus: builder.mutation({
            query: ({ taskIds, status }) => ({
                url: '/tasks/filter',
                method: 'POST',
                body: { taskIds, status }
            }),
            invalidatesTags: [{ type: 'Task', id: 'LIST' }]
        }),   
        getTasksByProjectId: builder.query({
            query: projectId => ({
                url: `/tasks/project/${projectId}`,
                method: 'GET'
            }),
            transformResponse: responseData => {
                const loadedTasks = responseData.map(task => {
                    task.id = task._id;
                    return task;
                });
                return tasksAdapter.setAll(initialState, loadedTasks);
            },
            providesTags: (result, error, arg) => {
                if (result?.ids) {
                    return [
                        { type: 'Task', id: 'LIST' },
                        ...result.ids.map(id => ({ type: 'Task', id }))
                    ]
                } else return [{ type: 'Task', id: 'LIST' }];
            }
        }), 
        getUserTasks: builder.query({
            query: (userId) => `/tasks/user/${userId}`, // Adjust the endpoint URL to match your backend route
            transformResponse: responseData => {
                const loadedTasks = responseData.map(task => {
                    task.id = task._id; // Ensure tasks have an 'id' property for normalization
                    return task;
                });
                return tasksAdapter.setAll(initialState, loadedTasks);
            },
            providesTags: (result, error, arg) => {
                if (result?.ids) {
                    return [
                        { type: 'Task', id: 'LIST' },
                        ...result.ids.map(id => ({ type: 'Task', id }))
                    ]
                } else return [{ type: 'Task', id: 'LIST' }]
            }
        }),
        manageReviewTasks: builder.mutation({
            query: reviewTasksData => ({
                url: '/tasks/manage-review-tasks',
                method: 'POST',
                body: reviewTasksData
            }),
            invalidatesTags: [
                { type: 'Task', id: "LIST" },
                { type: 'Review', id: "LIST" }
            ]
        }),    
    }),
})

export const {
    useGetTasksQuery,
    useGetTaskByIdQuery,
    useAddNewTaskMutation,
    useUpdateTaskMutation,
    useDeleteTaskMutation,
    useFilterTasksByStatusMutation,
    useGetTasksByProjectIdQuery,
    useGetUserTasksQuery,
    useManageReviewTasksMutation
} = tasksApiSlice

// returns the query result object
export const selectTasksResult = tasksApiSlice.endpoints.getTasks.select()

// creates memoized selector
const selectTasksData = createSelector(
    selectTasksResult,
    tasksResult => tasksResult.data // normalized state object with ids & entities
)

//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
    selectAll: selectAllTasks,
    selectById: selectTaskById,
    selectIds: selectTaskIds
    // Pass in a selector that returns the tasks slice of state
} = tasksAdapter.getSelectors(state => selectTasksData(state) ?? initialState)