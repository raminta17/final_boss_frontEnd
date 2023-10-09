import React from 'react';
import {useSelector} from "react-redux";

const SingleMessage = ({message}) => {

    const loggedInUser = useSelector(state => state.user.loggedInUser);

    return (
        <div className="messageBox"
             style={loggedInUser.username === message.username ? {alignSelf: 'end', backgroundColor:'grey'} : {alignSelf: 'start', backgroundColor:'lightgray'}}
        >
            <div>
                <b>{loggedInUser.username === message.username ? 'You' : message.username}: </b>
                <div className="message"> {message.message}</div>
            </div>
            <div className="date">{message.time}</div>
        </div>
    );
};

export default SingleMessage;