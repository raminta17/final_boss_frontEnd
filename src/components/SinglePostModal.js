import React, {useEffect, useRef} from 'react';
import SingleUser from "./SingleUser";
import {useDispatch, useSelector} from "react-redux";
import {socket} from "../App";
import {updateAllPosts} from "../features/user";

const SinglePostModal = ({author, setDisplay, display}) => {

    const loggedInUser = useSelector(state => state.user.loggedInUser);
    const post = useSelector(state=>state.user.openPost);
    const commentRef = useRef();
    function closeModal() {
        setDisplay('none')
    }
    function handlePostLike() {
        socket.emit('handleLike', post._id, loggedInUser._id);
    }
    function handleComments() {
        socket.emit('sendComment', commentRef.current.value, post._id, loggedInUser._id);
        commentRef.current.value = '';
    }

    return (
        <div className="myModal postModal" style={{display: display}}>
            {post &&
                <div className="modal-content">
                    <div className="text-end" onClick={closeModal}>
                        <i className="fa-regular fa-circle-xmark"></i>
                    </div>
                    <div className="d-flex gap-2">
                        <div className="f1">
                            <div className="modalImage">
                                <img src={post.image} alt=""/>
                            </div>
                        </div>
                        <div className="f1">
                            {author && <SingleUser user={author}/>}
                            <h2>
                                {post.title}
                            </h2>
                            <div className="d-flex gap-3 align-items-center">
                                <div onClick={handlePostLike} style={{cursor: 'pointer'}}>
                                    {!post.likes.includes(loggedInUser._id) ?
                                        <i className="fa-solid fa-thumbs-up"></i>
                                        :
                                        <i className="fa-solid fa-thumbs-down"></i> }
                                    <b>
                                        {post.likes.length}
                                    </b>
                                </div>
                                <div>
                                    <i className="fa-solid fa-comment"></i>
                                    <b>{post.comments.length}</b>
                                </div>
                            </div>
                            <div>
                                <div>{
                                    post.comments.map((comment, index) =>
                                        <div key={index}>
                                            <b>{comment.user}</b>
                                            <div>{comment.comment}</div>
                                        </div>
                                    )
                                }</div>
                                <input type="text" ref={commentRef} placeholder="comments"/>
                                <button onClick={handleComments}>COMMENT</button>
                            </div>
                        </div>

                    </div>
                </div>
            }
        </div>
);
};

export default SinglePostModal;