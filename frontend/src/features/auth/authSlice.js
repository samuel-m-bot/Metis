import { createSlice } from '@reduxjs/toolkit'

const authSlice = createSlice({
    name: 'auth',
    initialState: { 
        token: null,
        role: null,
        isLoggingOut: false // Add the isLoggingOut state variable
    },  
    reducers: {
        setCredentials: (state, action) => {
            const { accessToken, roles } = action.payload
            console.log(action.payload)
            state.token = accessToken
            state.role = roles
            state.isLoggingOut = false // Set isLoggingOut to false when credentials are set
        },
        logOutStart: (state) => {
            state.isLoggingOut = true; // Set isLoggingOut to true when the log out process starts
        },
        logOutSuccess: (state) => {
            state.token = null
            state.role = null
            state.isLoggingOut = false; // Set isLoggingOut back to false when the log out process is done
        },
    }
})

export const { setCredentials, logOutStart, logOutSuccess } = authSlice.actions

export default authSlice.reducer

export const selectCurrentToken = (state) => state.auth.token
export const selectCurrentUserRole = (state) => state.auth.role
export const selectIsLoggingOut = (state) => state.auth.isLoggingOut // Selector to get the isLoggingOut from state
