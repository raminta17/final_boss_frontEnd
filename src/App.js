import './App.css';
import {io} from 'socket.io-client';
import {Routes, Route} from "react-router-dom";
import StartPage from "./Pages/StartPage";
import ProfilePage from "./Pages/ProfilePage";
import MessagesPage from "./Pages/MessagesPage";
import PostsPage from "./Pages/PostsPage";
import AllUsersPage from "./Pages/AllUsersPage";
import {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useRef} from "react";
import {
    addNewConversation,
    addNewPost,
    updateAllPosts,
    updateAllUsers,
    updateLoggedInUser,
    updateOpenConversation,
    updateOpenPost,
    addNewMessage, updateAllConversations, updateSingleConversationUserStatus, updateSingleUser
} from "./features/user";

export const socket = io('http://localhost:8000', {
    autoConnect: false
});

function App() {

    const dispatch = useDispatch();
    let activePostSort = useSelector(state => state.user.activePostSort)
    let loggedInUser = useSelector(state => state.user.loggedInUser);
    let openConversation = useSelector(state => state.user.openConversation);
    let allUsers = useSelector(state => state.user.allUsers);
    const activePostSortRef = useRef(activePostSort);
    const loggedInUserRef = useRef(loggedInUser);
    const openConversationRef = useRef(openConversation);
    const allUsersRef = useRef(allUsers);

    // Update the ref whenever value in redux changes so I could see the change inside socket.on
    useEffect(() => {
        activePostSortRef.current = activePostSort;
    }, [activePostSort]);
    useEffect(() => {
        loggedInUserRef.current = loggedInUser;
    }, [loggedInUser]);
    useEffect(() => {
        openConversationRef.current = openConversation;
    }, [openConversation]);
    useEffect(() => {
        allUsersRef.current = allUsers;
    }, [allUsers]);

    useEffect(() => {
        if ((localStorage.getItem('TOKEN'))) {
            socket.auth = {
                token: localStorage.getItem('TOKEN')
            }
            socket.connect();
            const options = {
                method: 'GET',
                headers: {
                    'content-type': 'application/json',
                    authorization: localStorage.getItem('TOKEN')
                }
            }
            fetch('http://localhost:8000/getUserInfo', options)
                .then(res => res.json()).then(data => {
                dispatch(updateLoggedInUser(data.data))
            })
        }
        socket.on('sending new post', (allPosts, newPost) => {
            const currentActivePostSort = activePostSortRef.current;
            if (currentActivePostSort === 'oldest') {
                allPosts = allPosts.sort((post1, post2) => post1.time - post2.time);
                return dispatch(updateAllPosts(allPosts))
            }
            if (currentActivePostSort === 'newest') {
                allPosts = allPosts.slice().sort((post1, post2) => post2.time - post1.time);
                return dispatch(updateAllPosts(allPosts))
            }
            dispatch(addNewPost(newPost));
        })
        socket.on('updatingPost', (allPosts, updatedPostObj) => {
            dispatch(updateOpenPost(updatedPostObj));
            const currentActivePostSort = activePostSortRef.current;
            if (currentActivePostSort === 'mostComments') {
                allPosts = allPosts.sort((post1, post2) => (post2.comments.length - post1.comments.length));
                return dispatch(updateAllPosts(allPosts))
            }
            if (currentActivePostSort === 'leastComments') {
                allPosts = allPosts.slice().sort((post1, post2) => (post1.comments.length - post2.comments.length));
                return dispatch(updateAllPosts(allPosts))
            }
            if (currentActivePostSort === 'mostLikes') {
                allPosts = allPosts.sort((post1, post2) => (post2.likes.length - post1.likes.length));
                return dispatch(updateAllPosts(allPosts))
            }
            if (currentActivePostSort === 'leastLikes') {
                allPosts = allPosts.slice().sort((post1, post2) => (post1.likes.length - post2.likes.length));
                return dispatch(updateAllPosts(allPosts))
            }
            if (currentActivePostSort === 'oldest') {
                allPosts = allPosts.sort((post1, post2) => post1.time - post2.time);
                return dispatch(updateAllPosts(allPosts))
            }
            if (currentActivePostSort === 'newest') {
                allPosts = allPosts.slice().sort((post1, post2) => post2.time - post1.time);
                return dispatch(updateAllPosts(allPosts))
            }
            dispatch(updateAllPosts(allPosts));
        })
        socket.on('sendingAllUsers', data => {
            const currentLoggedInUser = loggedInUserRef.current;
            let allUsersExceptSelf = [];
            if (currentLoggedInUser) allUsersExceptSelf = data.filter(user => user._id !== currentLoggedInUser._id);
            dispatch(updateAllUsers(allUsersExceptSelf));
        })
        socket.on('sendingUserUpdate', user => {
            dispatch(updateSingleUser(user));
            dispatch(updateSingleConversationUserStatus(user));
        })
        socket.on('sendingConversations', conversations => {
            dispatch(updateAllConversations(conversations));
        })
        socket.on('sending new conversation', conversation => {
            dispatch(addNewConversation(conversation));
        })
        socket.on('new message in existing conversation', (conversationId, msg) => {
            const currentOpenConversation = openConversationRef.current;
            if (currentOpenConversation && currentOpenConversation._id === conversationId) dispatch(addNewMessage(msg));
        })
        socket.on('sendingSelectedConversation', conversation => {
            dispatch(updateOpenConversation(conversation))
        })
    }, []);

    window.addEventListener('beforeunload', (e) => {
        e.preventDefault();
        if (!JSON.parse(localStorage.getItem('auto-login'))) {
            socket.disconnect();
            return localStorage.removeItem('TOKEN')
        } else {
            socket.auth = {
                token: localStorage.getItem('TOKEN')
            }
            socket.connect();
        }
    })
    return (
        <div>
            <Routes>
                <Route path="/" element={<StartPage/>}/>
                <Route path="/profile" element={<ProfilePage/>}/>
                <Route path="/messages" element={<MessagesPage/>}/>
                <Route path="/posts" element={<PostsPage/>}/>
                <Route path="/allUsers" element={<AllUsersPage/>}/>
            </Routes>
        </div>
    );
}

export default App;
