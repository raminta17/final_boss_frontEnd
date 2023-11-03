import React from 'react';
import {useSelector} from "react-redux";

const SingleMessage = ({message}) => {

    const loggedInUser = useSelector(state => state.user.loggedInUser);

    return (
        <div className="messageBox"
             style={loggedInUser.username === message.username ? {
                 alignSelf: 'end',
                 backgroundColor: '#393E46',
                 color: '#EEEEEE'
             } : {alignSelf: 'start', backgroundColor: '#EEEEEE'}}
        >
            <div className="d-flex flex-column">
                <b>{loggedInUser.username === message.username ? 'You' : message.username} </b>
                <div className="message"> {message.message}</div>
            </div>
            {message.time && <div className="date">{message.time}</div>}
        </div>
    );
};

export default SingleMessage;