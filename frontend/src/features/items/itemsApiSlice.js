import { apiSlice } from '../../app/api/apiSlice';

export const itemsApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        canUserCheckOutAndInItem: builder.query({
            query: ({ itemId, userId }) => `/items/${itemId}/can-check-out/${userId}`,
            providesTags: (result, error, { itemId }) => [{ type: 'Item', id: itemId }],
        }),
        checkOutItem: builder.mutation({
            query: ({ itemId, userId, itemType }) => ({
                url: `/items/${itemId}/${itemType}/check-out/${userId}`, 
                method: 'POST'
            }),
            invalidatesTags: (result, error, { itemId }) => [{ type: 'Item', id: itemId }],
        }),        
        checkInItem: builder.mutation({
            query: ({ itemId, userId, itemType }) => ({
                url: `/items/${itemId}/${itemType}/check-in/${userId}`,
                method: 'POST'
            }),
            invalidatesTags: (result, error, { itemId }) => [{ type: 'Item', id: itemId }],
        }),        
    }),
});

export const {
    useCanUserCheckOutAndInItemQuery,
    useCheckOutItemMutation,
    useCheckInItemMutation,
} = itemsApiSlice;
