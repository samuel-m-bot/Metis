import { configureStore, createSlice} from "@reduxjs/toolkit";
import { apiSlice } from "./api/apiSlice";
import authReducer from '../features/auth/authSlice'

const apiResetSlice = createSlice({
    name: 'apiReset',
    initialState: false,
    reducers: {
        setApiReset: (state, action) => action.payload
    }
})
export const {setApiReset} = apiResetSlice.actions
export default apiResetSlice.reducer
export const store = configureStore({
    reducer: {
        [apiSlice.reducerPath]: apiSlice.reducer,
        auth: authReducer,
        apiReset: apiResetSlice.reducer,

    },
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware().concat(apiSlice.middleware),
    devTools: true
})