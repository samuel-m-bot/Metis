import {
    createSelector,
    createEntityAdapter
} from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";

const reviewsAdapter = createEntityAdapter({})

const initialState = reviewsAdapter.getInitialState()

export const reviewsApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getReviews: builder.query({
            query: () => ({
                url: '/reviews',
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError
                },
            }),
            transformResponse: responseData => {
                const loadedReviews = responseData.map(review => {
                    review.id = review._id
                    return review
                });
                return reviewsAdapter.setAll(initialState, loadedReviews)
            },
            providesTags: (result, error, arg) => {
                if (result?.ids) {
                    return [
                        { type: 'Review', id: 'LIST' },
                        ...result.ids.map(id => ({ type: 'Review', id }))
                    ]
                } else return [{ type: 'Review', id: 'LIST' }]
            }
        }),
        getReviewById: builder.query({
            query: (id) => ({
                url: `/reviews/${id}`,
                method: 'GET'
            }),
            transformResponse: responseData => {
                const review = { ...responseData, id: responseData._id };
                return review;
            },
            providesTags: (result, error, arg) => [{ type: 'Review', id: result.id }]
        }),
        addNewReview: builder.mutation({
            query: initialReviewData => ({
                url: '/reviews',
                method: 'POST',
                body: {
                    ...initialReviewData,
                }
            }),
            invalidatesTags: [
                { type: 'Review', id: "LIST" }
            ]
        }),
        updateReview: builder.mutation({
            query: (reviewData) => ({
                url: `/reviews/${reviewData.id}`,
                method: 'PATCH',
                body: reviewData
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'Review', id: arg.id },
                { type: 'Review', id: "LIST" }
            ]
        }),
        deleteReview: builder.mutation({
            query: ({ id }) => ({
                url: `/reviews/${id}`,
                method: 'DELETE'
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'Review', id: arg.id }
            ]
        }),
    }),
})

export const {
    useGetReviewsQuery,
    useGetReviewByIdQuery,
    useAddNewReviewMutation,
    useUpdateReviewMutation,
    useDeleteReviewMutation,
} = reviewsApiSlice

const selectReviewsResult = reviewsApiSlice.endpoints.getReviews.select()
const selectReviewsData = createSelector(
    selectReviewsResult,
    reviewsResult => reviewsResult.data
)

export const {
    selectAll: selectAllReviews,
    selectById: selectReviewById,
    selectIds: selectReviewIds
} = reviewsAdapter.getSelectors(state => selectReviewsData(state) ?? initialState)