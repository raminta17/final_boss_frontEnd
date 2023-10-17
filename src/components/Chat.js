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
            <div className="chatBox">
                {loggedInUser && conversation && conversation.messages.map((message, index) =>
                    <SingleMessage key={index} message={message}/>
                )}
                <div ref={chatRef}></div>
            </div>
        </>

    );
};

export default Chat;