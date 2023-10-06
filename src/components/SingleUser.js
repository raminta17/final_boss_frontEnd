import React from 'react';
import Message_newPost_Modal from "./Message_newPost_Modal";
import {useState} from "react";
import {useSelector} from "react-redux";

const SingleUser = ({user}) => {

    const [display, setDisplay] = useState('none');
    const loggedInUser = useSelector(state=>state.user.loggedInUser);

    return (
        <div className="box singleUser" >
            <div className="navUserLogo">
                <img style={{border: user.isOnline ? '5px solid green': ' 5px solid red'}} src={user.profileImg} alt=""/>
                <b>{user.username}</b>
                {user.username !== loggedInUser.username && <button onClick={() => setDisplay('block')}>SEND A MESSAGE</button>}
            </div>
           <Message_newPost_Modal type={'message'} user={user} setDisplay={setDisplay} display={display}/>
        </div>
    );
};

export default SingleUser;