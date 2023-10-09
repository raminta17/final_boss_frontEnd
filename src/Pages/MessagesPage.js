import React, {useEffect} from 'react';
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {updateAllConversations, updateAllPosts, updateLoggedInUser} from "../features/user";
import NavBar from "../components/NavBar";
import SingleUser from "../components/SingleUser";
import Chat from "../components/Chat";

const MessagesPage = () => {
    const nav = useNavigate();
    const dispatch = useDispatch();
    const loggedInUser = useSelector(state => state.user.loggedInUser);
    const allConversations = useSelector(state => state.user.allConversations);

    useEffect(() => {
        if (!localStorage.getItem('TOKEN')) {
            dispatch(updateLoggedInUser());
            nav('/');
        }
    }, []);

    useEffect(() => {
        if(loggedInUser)
        fetch('http://localhost:8000/getAllConversations/'+ loggedInUser.username)
            .then(res => res.json()).then(data => {
            console.log('all conversation from back end fetch', data);
            dispatch(updateAllConversations(data.data));
        })
    }, [loggedInUser]);

    return (
        <>
            <NavBar/>
            <div className="page">
                <div className="f1 h-100 d-flex flex-column justify-content-start gap-2 overflow-auto p-2">
                    {loggedInUser && allConversations.length > 0 && allConversations.map(conversation =>
                        <SingleUser
                            key={conversation._id}
                            user={conversation.users.filter(user => user !== loggedInUser.username)[0]}
                            conversationId={conversation._id}
                        />
                    )}
                </div>
                <div className="f3">
                    <Chat />
                </div>
            </div>
        </>
    );
};

export default MessagesPage;