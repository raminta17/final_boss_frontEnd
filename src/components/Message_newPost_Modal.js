import React, {useRef, useState} from 'react';
import {socket} from "../App";
import {useSelector} from "react-redux";
import SingleUser from "./SingleUser";



const Message_newPost_Modal = ({type, user, setDisplay, display}) => {


    const messageRef = useRef();
    const titleRef = useRef();
    const imageRef = useRef();
    const [error, setError] = useState();
    const loggedInUser = useSelector(state=>state.user.loggedInUser);

    function sendMessage() {
        if (!messageRef.current.value) return setError('Note: your message cannot be empty.')
        socket.emit('sendingMessage', messageRef.current.value, user.username);
        setError('Message sent successfully.');
        messageRef.current.value = '';
    }
    function createNewPost() {
        if (!titleRef.current.value) return setError('Note: you have to give title to your post.')
        if (!imageRef.current.value) return setError('Note : you have to add an image to your post.')
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
    function closeModal() {
        setDisplay('none');
        setError();
    }


    return (
        <div className="myModal messageModal" style={{display: display}}>
            <div className="modal-content">
                <div className="text-end" onClick={closeModal}>
                    <i className="fa-regular fa-circle-xmark close"></i>
                </div>
                {user && type === 'message' ?
                    <div className="text-center d-flex flex-column gap-4">
                        <div className="navUserLogo position-relative">
                            <img src={user.profileImg} alt=""/>
                            <div className="position-absolute online" style={{backgroundColor: user.isOnline ? '#18a818' : 'lightgray', border: '2px solid white',width:'12px', height: '12px', borderRadius: '50%'}}></div>

                            <div> {user.username}</div>
                        </div>
                        <textarea rows="4" ref={messageRef} placeholder="message"/>
                        <button onClick={sendMessage}>SEND</button>
                    </div>
                    :
                    <div className="text-center d-flex flex-column gap-4">
                        <div>CREATE NEW POST</div>
                        <input type="text" ref={titleRef} placeholder="post title"/>
                        <input type="text" ref={imageRef} placeholder="post image url"/>
                        <button onClick={createNewPost}>POST</button>
                    </div>
                }
                <div className="error">{error}</div>
            </div>
        </div>
    );
};

export default Message_newPost_Modal;