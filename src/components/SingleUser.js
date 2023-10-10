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
            <div className="navUserLogo justify-content-between">
                <div className="d-flex align-items-center ">
                    {typeof user !== 'string' ? <img style={{border: user.isOnline ? '5px solid  #18a818': ' 5px solid #f35353'}} src={user.profileImg} alt=""/> : ''}

                    <b className="username">{typeof user !== 'string' ? user.username : user}</b>
                </div>

                    {user.username !== loggedInUser.username && typeof user !== 'string' && <button onClick={() => setDisplay('block')}>MESSAGE</button>}


            </div>
           <Message_newPost_Modal type={'message'} user={user} setDisplay={setDisplay} display={display}/>
        </div>
    );
};

export default SingleUser;