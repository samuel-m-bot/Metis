import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'
import { setCredentials } from '../../features/auth/authSlice'

const baseQuery = fetchBaseQuery({
    baseUrl:'http://localhost:3500',
    credentials: 'include',
    prepareHeaders: (headers, {getState}) => {
        const token = getState().auth.token
        if(token){
            headers.set("authorization", `Bearer ${token}`)
        }
        return headers
    }
})

const baseQueryWithReAuth = async (args, api, extraOptions) => {
    console.log("Passed 1")
    let result = await baseQuery(args, api, extraOptions)

    console.log("Passed 2")
    if(result?.error?.status == 403){
        console.log("Sending refresh token")

        const refreshResult = await baseQuery('/auth/refresh', api, extraOptions)

        if(refreshResult?.data){
            api.dispatch(setCredentials({...refreshResult.data}))

            result = await baseQuery(args, api, extraOptions)
        }else{
            if(refreshResult?.error?.status === 403)
                refreshResult.error.data.message="Yor login has expired"
        
            return refreshResult
        }
    }
    return result
}


export const apiSlice = createApi({
    //baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3500'}),
    baseQuery: baseQueryWithReAuth,
    tagTypes: ['User', 'ChangeRequest', 'Design', 'Documents', 'Products', 'Projects', 'Tasks', 'Integration', 'Review'],
    endpoints: builder => ({})
})