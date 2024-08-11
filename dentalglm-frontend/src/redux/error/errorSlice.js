import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    status: false,
    success: null,
    message: '',
};

const errorSlice = createSlice({
    name: 'error',
    initialState,
    reducers: {
        setError: (state, action) => {
            state.status = true;
            state.success = false;
            state.message = action.payload;
        },
        setSuccess: (state, action) => {
            state.status = true;
            state.success = true;
            state.message = action.payload;
        },
        clearAlert: (state) => {
            state.status = false;
            state.success = null;
            state.message = '';
        },
    },
});

export const { setError, setSuccess, clearAlert } = errorSlice.actions;

export default errorSlice.reducer;