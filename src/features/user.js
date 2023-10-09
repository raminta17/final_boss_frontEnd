import {createSlice} from "@reduxjs/toolkit";

export const userSlice = createSlice({
    name: 'player',
    initialState: {
        loggedInUser: null,
        allUsers: [],
        allPosts: [],
        openPost: null,
        activePostSort: null,
        allConversations: [],
        openConversation: null
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
        },
        updateAllPosts: (state,action) => {
            state.allPosts = action.payload;
        },
        addNewPost: (state,action) => {
            state.allPosts.push(action.payload);
        },
        updateOpenPost: (state, action) => {
            state.openPost = action.payload;
        },
        updateActivePostSort: (state, action) => {
            state.activePostSort = action.payload;
        },
        updateAllConversations: (state, action) => {
            state.allConversations = action.payload;
        },
        addNewConversation: (state, action) => {
            state.allConversations.push(action.payload);
        },
        updateOpenConversation: (state, action) => {
            state.openConversation = action.payload;
        },
        addNewMessage: (state, action) => {
            state.openConversation.messages.push(action.payload);
        }
    }
})

export const {updateLoggedInUser,
    updateImg,
    updateAllUsers,
    updateAllPosts,
    addNewPost,
    updateOpenPost,
    updateActivePostSort,
updateAllConversations,
    addNewConversation,
    updateOpenConversation,
    addNewMessage} = userSlice.actions;

export default userSlice.reducer;