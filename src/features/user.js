import {createSlice} from "@reduxjs/toolkit";

export const userSlice = createSlice({
    name: 'player',
    initialState: {
        loggedInUser: null,
        allUsers: []
    },
    reducers: {
        updateLoggedInUser: (state, action) => {
            state.loggedInUser = action.payload;
        },
        updateImg: (state,action) => {
            state.loggedInUser.profileImg = action.payload;
        },
        updateAllUsers: (state,action) => {
            state.allUsers = action.payload;
        }
    }
})

export const {updateLoggedInUser,
    updateImg,
    updateAllUsers} = userSlice.actions;

export default userSlice.reducer;