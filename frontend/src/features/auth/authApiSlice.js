import { apiSlice } from "../../app/api/apiSlice"
import { setCredentials, logOut } from "./authSlice"

export const authApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        login: builder.mutation({
            query: credentials => ({
                url: '/auth',
                method: 'POST',
                body: { ...credentials }
            })
        }),
        sendLogout: builder.mutation({
            query: () => ({
                url: '/auth/logout',
                method: 'POST',
            }),
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled
                    console.log(data)
                    dispatch(logOut())
                    setTimeout(() => {
                        dispatch(apiSlice.util.resetApiState())
                    }, 1000)
                } catch (err) {
                    console.log(err)
                }
            }
        }),
        refresh: builder.mutation({
            query: () => ({
                url: '/auth/refresh',
                method: 'GET',
            }),
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled
                    console.log(data)
                    const { accessToken } = data
                    dispatch(setCredentials({ accessToken }))
                } catch (err) {
                    console.log(err)
                }
            }
        }),
        salesforceLogin: builder.mutation({
            query: () => ({
                url: '/auth/salesforce',
                method: 'GET',
            }),
            async onQueryStarted(arg, { queryFulfilled }) {
                try {
                    const response = await queryFulfilled;
                } catch (error) {
                    console.error('Error initiating Salesforce OAuth:', error);
                }
            }
        }),
        checkAccessToken: builder.query({
            query: () => ({
                url: 'auth/test/access-token',
                method: 'GET',
            }),
            transformResponse: response => response, 
        }),
    })
})

export const {
    useLoginMutation,
    useSendLogoutMutation,
    useRefreshMutation,
    useSalesforceLoginMutation,
    useCheckAccessTokenQuery,
    useLazyCheckAccessTokenQuery
} = authApiSlice 
