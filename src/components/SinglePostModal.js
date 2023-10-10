import React, {useEffect, useRef} from 'react';
import SingleUser from "./SingleUser";
import {useDispatch, useSelector} from "react-redux";
import {socket} from "../App";
import {updateAllPosts} from "../features/user";
import SingleMessage from "./SingleMessage";

const SinglePostModal = ({author, setDisplay, display, time}) => {

    const loggedInUser = useSelector(state => state.user.loggedInUser);
    const post = useSelector(state=>state.user.openPost);
    const commentRef = useRef();
    const commentsDivRef = useRef();

    const scrollToBottom = () => {
        commentsDivRef.current?.scrollIntoView({behavior: "smooth"})
    }

    useEffect(() => {
        scrollToBottom()
    }, [post]);
    function closeModal() {
        setDisplay('none')
    }
    function handlePostLike() {
        socket.emit('handleLike', post._id, loggedInUser._id);
    }
    function handleComments(e) {
        e.preventDefault();
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
                    <div className="openPostCont gap-4">
                        <div className="f1 d-flex align-items-center">
                            <div className="modalImage">
                                <img src={post.image} alt=""/>
                            </div>
                        </div>
                        <div className="f1">
                            {author && <SingleUser user={author}/>}
                            <div className="date">{time}</div>
                            <h2>
                                {post.title}
                            </h2>
                            <div className="d-flex gap-3 align-items-center">
                                <div className="d-flex justify-content-between w-100">
                                    <h4>Comments</h4>
                                    <div className="d-flex gap-4">
                                        <div className="d-flex align-items-center gap-2" onClick={handlePostLike} style={{cursor: 'pointer'}}>
                                            {!post.likes.includes(loggedInUser._id) ?
                                                <i className="fa-solid fa-thumbs-up"></i>
                                                :
                                                <i className="fa-solid fa-thumbs-down"></i> }
                                            <b>
                                                {post.likes.length}
                                            </b>
                                        </div>
                                        <div  className="d-flex align-items-center gap-2">
                                            <i className="fa-solid fa-comment"></i>
                                            <b>{post.comments.length}</b>
                                        </div>
                                    </div>

                                </div>

                            </div>
                            <div>
                                <div className="commentsDiv mt-2">{
                                    post.comments.length === 0 ?
                                        <div>No comments yet</div>
                                        :
                                        <div>
                                            {post.comments.map((comment, index) =>
                                            <SingleMessage key={index} message={comment}/>
                                            )}
                                            <div ref={commentsDivRef}></div>
                                        </div>

                                            }</div>
                                <form onSubmit={handleComments} className="openPostInputDiv">
                                    <input type="text" ref={commentRef} placeholder="your comment..."/>
                                    <button type="submit">COMMENT</button>
                                </form>

                            </div>
                        </div>

                    </div>
                </div>
            }
        </div>
);
};

export default SinglePostModal;