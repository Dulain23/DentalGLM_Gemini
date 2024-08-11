import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    currentUser: JSON.parse(sessionStorage.getItem('persist:root'))?.user?.currentUser || null,
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        loginSuccess: (state, action) => {
            state.currentUser = action.payload;
        },
        logoutSuccess: (state) => {
            state.currentUser = null;
        },
        updateSuccess: (state, action) => {
            state.currentUser = action.payload;
        }
    }
});

export const { loginSuccess, logoutSuccess, updateSuccess } = userSlice.actions;

export default userSlice.reducer;

