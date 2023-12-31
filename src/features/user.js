import {createSlice} from "@reduxjs/toolkit";

export const userSlice = createSlice({
    name: 'player',
    initialState: {
        loggedInUser: null,
        allUsers: [],
        allPosts: [],
        openPost: null,
        activePostSort: 'newest',
        allConversations: [],
        openConversation: null
    },
    reducers: {
        updateLoggedInUser: (state, action) => {
            state.loggedInUser = action.payload;
        },
        updateImg: (state, action) => {
            state.loggedInUser.profileImg = action.payload;
        },
        updateAllUsers: (state, action) => {
            state.allUsers = action.payload;
        },
        updateAllPosts: (state, action) => {
            state.allPosts = action.payload;
        },
        addNewPost: (state, action) => {
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
        updateSingleConversationUserStatus: (state, action) => {
            state.allConversations = state.allConversations.map(conversation => {
                if (conversation.username !== action.payload.username) return conversation;
                conversation.isOnline = action.payload.isOnline;
                conversation.profileImg = action.payload.profileImg;
                return conversation;
            })
        },
        updateSingleUser: (state, action) => {
            if(state.allUsers.find(user => user.username === action.payload.username)){
                state.allUsers = state.allUsers.map(user => {
                    if (user.username !== action.payload.username) return user;
                    user.isOnline = action.payload.isOnline;
                    user.profileImg = action.payload.profileImg;
                    return user;
                })
            }else {
                state.allUsers.push(action.payload);
            }
            state.allUsers = state.allUsers.sort((user1,user2) => user2.isOnline - user1.isOnline);
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

export const {
    updateLoggedInUser,
    updateImg,
    updateAllUsers,
    updateAllPosts,
    addNewPost,
    updateOpenPost,
    updateActivePostSort,
    updateAllConversations,
    updateSingleConversationUserStatus,
    updateSingleUser,
    addNewConversation,
    updateOpenConversation,
    addNewMessage
} = userSlice.actions;

export default userSlice.reducer;