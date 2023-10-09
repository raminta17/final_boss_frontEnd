import React, {useRef, useState} from 'react';
import {socket} from "../App";
import {useSelector} from "react-redux";



const Message_newPost_Modal = ({type, user, setDisplay, display}) => {


    const messageRef = useRef();
    const titleRef = useRef();
    const imageRef = useRef();
    const [error, setError] = useState();
    const loggedInUser = useSelector(state=>state.user.loggedInUser);
    console.log('loggedInUser', loggedInUser);

    function sendMessage() {
        if (!messageRef.current.value) return setError('Your message cannot be empty.')
        socket.emit('sendingMessage', messageRef.current.value, user.username);
        setError('Message sent successfully.');
        messageRef.current.value = '';
    }
    function createNewPost() {
        if (!titleRef.current.value) return setError('You have to give title to your post.')
        if (!imageRef.current.value) return setError('You have to add an image to your post.')
        const newPost = {
            authorId: loggedInUser._id,
            title: titleRef.current.value,
            image: imageRef.current.value
        }
        socket.emit('creatingNewPost', newPost);
        setError('Post created successfully.');
        titleRef.current.value = '';
        imageRef.current.value = '';
    }


    return (
        <div className="myModal messageModal" style={{display: display}}>
            <div className="modal-content">
                <div className="text-end" onClick={() => setDisplay('none')}>
                    <i className="fa-regular fa-circle-xmark"></i>
                </div>
                {user && type === 'message' ?
                    <div>
                        <div>PRIVATE MESSAGE TO {user.username}</div>
                        <input type="text" ref={messageRef} placeholder="message"/>
                        <button onClick={sendMessage}>SEND</button>
                    </div>
                    :
                    <div>
                        <div>CREATE NEW POST</div>
                        <input type="text" ref={titleRef} placeholder="post title"/>
                        <input type="text" ref={imageRef} placeholder="post image url"/>
                        <button onClick={createNewPost}>CREATE</button>
                    </div>
                }
                <div>{error}</div>
            </div>
        </div>
    );
};

export default Message_newPost_Modal;