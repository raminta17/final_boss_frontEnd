import React from 'react';
import Message_newPost_Modal from "./Message_newPost_Modal";
import {useState} from "react";
import {useSelector} from "react-redux";
import {socket} from "../App";

const SingleUser = ({user, hideMessageButton,selected, setSelected}) => {

    const [display, setDisplay] = useState('none');
    const loggedInUser = useSelector(state=>state.user.loggedInUser);


    function startConversation() {
        if(setSelected) setSelected(user.username);
        socket.emit('startConversation', user.conversationId);
    }

    return (
        <div className="box singleUser" style={{backgroundColor: selected === user.username? 'white' : ''}} onClick={startConversation}>
            <div className="navUserLogo justify-content-between">
                <div className="d-flex align-items-center ">
                    <img style={{border: user.isOnline ? '5px solid  #18a818': ' 5px solid #f35353'}} src={user.profileImg} alt=""/>

                    <b className="wordBreak">{user.username}</b>
                </div>

                    {user.username !== loggedInUser.username && !hideMessageButton && <button onClick={() => setDisplay('block')}>MESSAGE</button>}


            </div>
           <Message_newPost_Modal type={'message'} user={user} setDisplay={setDisplay} display={display}/>
        </div>
    );
};

export default SingleUser;