import React, {useEffect, useRef} from 'react';
import {useSelector} from "react-redux";
import SingleMessage from "./SingleMessage";

const Chat = () => {

    const chatRef = useRef();
    const conversation = useSelector(state => state.user.openConversation);
    const loggedInUser = useSelector(state => state.user.loggedInUser);

    const scrollToBottom = () => {
        chatRef.current?.scrollIntoView({behavior: "smooth"})
    }

    useEffect(() => {
        scrollToBottom()
    }, [conversation]);

    return (
        <>
            <div className="chatBox" style={{backgroundColor: conversation ? 'white' : ''}}>
                {loggedInUser && conversation ? conversation.messages.map((message, index) =>
                        <SingleMessage key={index} message={message}/>
                    )
                    :
                    <div className="h-100 d-flex align-items-center justify-content-center gap-2">
                        <i className="fa-solid fa-arrow-left arrow"></i>
                        Select a conversation</div>}
                <div ref={chatRef}></div>
            </div>
        </>
    );
};

export default Chat;