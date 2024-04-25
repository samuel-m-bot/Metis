import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";

const reviewsAdapter = createEntityAdapter({})

const initialState = reviewsAdapter.getInitialState()

export const reviewsApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getReviews: builder.query({
            query: () => '/reviews',
            transformResponse: responseData => {
                const loadedReviews = responseData.map(review => {
                    review.id = review._id
                    return review
                });
                return reviewsAdapter.setAll(initialState, loadedReviews)
            },
            providesTags: (result, error, arg) => result ? [...result.ids.map(id => ({ type: 'Review', id })), { type: 'Review', id: 'LIST' }] : [{ type: 'Review', id: 'LIST' }]
        }),
        getReviewById: builder.query({
            query: id => `/reviews/${id}`,
            providesTags: (result, error, arg) => [{ type: 'Review', id: arg }]
        }),
        getReviewsByItemReviewed: builder.query({
            query: itemReviewedId => `/reviews/item/${itemReviewedId}`,
            transformResponse: responseData => {
                const loadedReviews = responseData.map(review => {
                    review.id = review._id;
                    return review;
                });
                return reviewsAdapter.setAll(initialState, loadedReviews);
            },
            providesTags: (result, error, arg) => result ? 
                [...result.ids.map(id => ({ type: 'Review', id })), { type: 'Review', id: 'LIST' }] : 
                [{ type: 'Review', id: 'LIST' }]
        }),
        addNewReview: builder.mutation({
            query: initialReviewData => ({
                url: '/reviews',
                method: 'POST',
                body: initialReviewData,
            }),
            invalidatesTags: [{ type: 'Review', id: 'LIST' }]
        }),
        updateReview: builder.mutation({
            query: ({ id, ...reviewData }) => ({
                url: `/reviews/${id}`,
                method: 'PATCH',
                body: reviewData
            }),
            invalidatesTags: (result, error, arg) => [{ type: 'Review', id: arg.id }]
        }),
        deleteReview: builder.mutation({
            query: id => ({
                url: `/reviews/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: (result, error, arg) => [{ type: 'Review', id: arg.id }]
        }),
        reviewSubmission: builder.mutation({
            query: ({ id, reviewerId, feedback, decision }) => ({
                url: `/reviews/${id}/submit`,
                method: 'PATCH',
                body: { reviewerId, feedback, decision }
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'Review', id: arg.id },
                { type: 'Review', id: 'LIST' }
            ]
        }),
    }),
})

export const {
    useGetReviewsQuery,
    useGetReviewByIdQuery,
    useGetReviewsByItemReviewedQuery,
    useAddNewReviewMutation,
    useUpdateReviewMutation,
    useDeleteReviewMutation,
    useReviewSubmissionMutation,
} = reviewsApiSlice

export const {
    selectAll: selectAllReviews,
    selectById: selectReviewById,
    selectIds: selectReviewIds
} = reviewsAdapter.getSelectors(state => state.reviews ?? initialState)