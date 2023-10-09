import React, {useEffect, useRef} from 'react';
import {socket} from "../App";
import {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {updateUsername} from "../features/user";
import SingleMessage from "./SingleMessage";

const Chat = () => {

    const dispatch = useDispatch();
    const messageRef = useRef();
    const chatRef = useRef();
    const conversation = useSelector(state => state.user.openConversation);
    const loggedInUser = useSelector(state => state.user.loggedInUser);
    const [error, setError] = useState();

    // useEffect(() => {
    //     socket.on('message', data => {
    //         setMessages(messages=>[...messages,data])
    //     })
    // }, []);
    const scrollToBottom = () => {
        chatRef.current?.scrollIntoView({behavior: "smooth"})
    }

    useEffect(() => {
        scrollToBottom()
    }, [conversation]);

    function sendMsg(e) {
        e.preventDefault();
        if (!messageRef.current.value) return setError("You can't send an empty message.");
        socket.emit('sendingMessage', messageRef.current.value, conversation.users.filter(user => user !== loggedInUser.username)[0], conversation._id)
        setError();
        messageRef.current.value = '';
    }

    return (
        <>
            {loggedInUser && conversation &&
                <div className="chat">
                    <div className="chatBox">{conversation.messages.map((message, index) =>
                        <SingleMessage key={index} message={message}/>
                    )}
                        <div ref={chatRef}></div>
                    </div>
                    <div>{error}</div>
                    <form className="inputs" onSubmit={sendMsg}>
                        <input type="text" ref={messageRef} placeholder="Your message..."/>
                        <button type={"submit"}>SEND</button>
                    </form>
                </div>
            }
        </>

    );
};

export default Chat;