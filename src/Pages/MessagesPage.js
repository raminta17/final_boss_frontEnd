import React, {useEffect, useRef, useState} from 'react';
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {updateAllConversations, updateAllPosts, updateLoggedInUser} from "../features/user";
import NavBar from "../components/NavBar";
import SingleUser from "../components/SingleUser";
import Chat from "../components/Chat";
import {socket} from "../App";

const MessagesPage = () => {
    const nav = useNavigate();
    const dispatch = useDispatch();
    const messageRef = useRef();
    const loggedInUser = useSelector(state => state.user.loggedInUser);
    const allConversations = useSelector(state => state.user.allConversations);
    const conversation = useSelector(state => state.user.openConversation);
    const [selected, setSelected] =useState(null);
    const [error, setError] = useState();

    useEffect(() => {
        if (!localStorage.getItem('TOKEN')) {
            dispatch(updateLoggedInUser());
            nav('/');
        }
        if(conversation) setSelected(conversation.users.find(user => user !== loggedInUser.username))
    }, []);

    useEffect(() => {
        if(loggedInUser)
        fetch('http://localhost:8000/getAllConversations/'+ loggedInUser.username)
            .then(res => res.json()).then(data => {
            dispatch(updateAllConversations(data.data));
        })
    }, [loggedInUser]);

    function sendMsg(e) {
        e.preventDefault();
        if (!messageRef.current.value) return setError("You can't send an empty message.");
        socket.emit('sendingMessage', messageRef.current.value, conversation.users.filter(user => user !== loggedInUser.username)[0], conversation._id)
        setError();
        messageRef.current.value = '';
    }

    return (
        <>
            <NavBar/>
            <div className="contentPage messagesPage">
                <div className="conversations f1 w-100 gap-1">
                    {loggedInUser && allConversations.length > 0 ? allConversations.map(conversation =>
                        <SingleUser
                            key={conversation.conversationId}
                            user={conversation}
                            hideMessageButton={true}
                            selected={selected}
                            setSelected={setSelected}
                        />
                    ):
                    <div>No conversations available.</div>}
                </div>
                <div className="f3 w-100">
                    <div className="chat">
                    <Chat />
                        {selected &&  <form className="inputs" onSubmit={sendMsg}>
                            <input type="text" ref={messageRef} placeholder="Your message..." />
                            <button type={"submit"}>SEND</button>
                        </form>
                        }
                        <div className="error">{error}</div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default MessagesPage;