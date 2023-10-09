import React from 'react';
import Message_newPost_Modal from "./Message_newPost_Modal";
import {useState} from "react";
import {useSelector} from "react-redux";
import {socket} from "../App";

const SingleUser = ({user, conversationId}) => {

    const [display, setDisplay] = useState('none');
    const loggedInUser = useSelector(state=>state.user.loggedInUser);

    function openConversation() {
        socket.emit('openConversation', conversationId);
    }

    return (
        <div className="box singleUser" onClick={openConversation}>
            <div className="navUserLogo">
                {typeof user !== 'string' ? <img style={{border: user.isOnline ? '5px solid green': ' 5px solid red'}} src={user.profileImg} alt=""/> : ''}
                <b>{typeof user !== 'string' ? user.username : user}</b>
                {user.username !== loggedInUser.username && typeof user !== 'string' && <button onClick={() => setDisplay('block')}>SEND A MESSAGE</button>}
            </div>
           <Message_newPost_Modal type={'message'} user={user} setDisplay={setDisplay} display={display}/>
        </div>
    );
};

export default SingleUser;