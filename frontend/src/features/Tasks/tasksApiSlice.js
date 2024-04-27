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
            query: ({ page = 1, limit = 10 } = {}) => ({
                url: `/tasks?page=${page}&limit=${limit}`,
                method: 'GET'
            }),
            transformResponse: responseData => {
                const loadedTasks = responseData.tasks.map(task => {
                    task.id = task._id;
                    return task;
                });
                return {
                    tasks: tasksAdapter.setAll(initialState, loadedTasks),
                    totalPages: responseData.totalPages,
                    currentPage: responseData.currentPage
                };
            },
            providesTags: (result, error, arg) => {
                if (result?.tasks.ids) {
                    return [
                        { type: 'Task', id: 'LIST' },
                        ...result.tasks.ids.map(id => ({ type: 'Task', id }))
                    ];
                } else return [{ type: 'Task', id: 'LIST' }];
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
            query: ({ projectId, page = 1, limit = 10 } = {}) => ({
                url: `/tasks/project/${projectId}?page=${page}&limit=${limit}`,
                method: 'GET'
            }),
            transformResponse: responseData => {
                const loadedTasks = responseData.tasks.map(task => {
                    task.id = task._id;
                    return task;
                });
                return {
                    tasks: tasksAdapter.setAll(initialState, loadedTasks),
                    totalPages: responseData.totalPages,
                    currentPage: responseData.currentPage
                };
            },
            providesTags: (result, error, arg) => {
                if (result?.tasks.ids) {
                    return [
                        { type: 'Task', id: 'LIST' },
                        ...result.tasks.ids.map(id => ({ type: 'Task', id }))
                    ];
                } else return [{ type: 'Task', id: 'LIST' }];
            }
        }),        
        getUserTasks: builder.query({
            query: ({ userId, page = 1, limit = 10 } = {}) => ({
                url: `/tasks/user/${userId}?page=${page}&limit=${limit}`,
                method: 'GET'
            }),
            transformResponse: responseData => {
                const loadedTasks = responseData.tasks.map(task => {
                    task.id = task._id;
                    return task;
                });
                return {
                    tasks: tasksAdapter.setAll(initialState, loadedTasks),
                    totalPages: responseData.totalPages,
                    currentPage: responseData.currentPage
                };
            },
            providesTags: (result, error, arg) => {
                if (result?.tasks.ids) {
                    return [
                        { type: 'Task', id: 'LIST' },
                        ...result.tasks.ids.map(id => ({ type: 'Task', id }))
                    ];
                } else return [{ type: 'Task', id: 'LIST' }];
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
        completeTaskAndSetupReview: builder.mutation({
            query: taskSetupData => ({
                url: '/tasks/complete-and-setup-review',
                method: 'POST',
                body: taskSetupData
            }),
            invalidatesTags: [
                { type: 'Task', id: "LIST" }
            ]
        }), 
        handleUpdateTaskStatus: builder.mutation({
            query: ({ taskId, status }) => ({
                url: `/tasks/${taskId}/status`,
                method: 'PATCH',
                body: { status }
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'Task', id: arg.taskId },
                { type: 'Task', id: "LIST" }
            ],
            onQueryStarted: async ({ taskId, status }, { dispatch, queryFulfilled }) => {
                try {
                    const patchResult = dispatch(
                        tasksApiSlice.util.updateQueryData('getTaskById', taskId, draft => {
                            if (draft.status === status) {
                                throw new Error(`Task already set to status '${status}'.`);
                            }
                            draft.status = status;
                        })
                    );
                    try {
                        await queryFulfilled;
                    } catch {
                        patchResult.undo();
                    }
                } catch (error) {
                    alert(error.message);
                }
            }
        }),
        manageRevisedTask: builder.mutation({
            query: revisedTaskData => ({
                url: '/tasks/manage-revised-task',
                method: 'POST',
                body: revisedTaskData
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
    useManageReviewTasksMutation,
    useCompleteTaskAndSetupReviewMutation,
    useHandleUpdateTaskStatusMutation,
    useManageRevisedTaskMutation
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