import { apiSlice } from "../../app/api/apiSlice"
import { setCredentials, logOutStart, logOutSuccess } from "./authSlice"
import { setApiReset } from "../../app/store"
import store from "../../app/store"

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
                    dispatch(logOutStart()); // Start logging out process
                    
                    await queryFulfilled
                    
                    setTimeout(async () => {
                        await dispatch(apiSlice.util.resetApiState()) // Wait for api reset
                        dispatch(logOutSuccess()); // End logging out process
                        dispatch(setApiReset(true));
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
    })
})

export const {
    useLoginMutation,
    useSendLogoutMutation,
    useRefreshMutation,
} = authApiSlice 
