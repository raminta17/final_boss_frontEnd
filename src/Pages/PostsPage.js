import React, {useEffect, useState} from 'react';
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {updateLoggedInUser, updateAllPosts, updateActivePostSort} from "../features/user";
import NavBar from "../components/NavBar";
import Message_newPost_Modal from "../components/Message_newPost_Modal";
import SinglePost from "../components/SinglePost";
import SingleUser from "../components/SingleUser";
import SortButtons from "../components/SortButtons";

const PostsPage = () => {
    const nav = useNavigate();
    const dispatch = useDispatch();
    const [display, setDisplay] = useState('none');
    const allUsers = useSelector(state => state.user.allUsers);
    const allPosts = useSelector(state => state.user.allPosts);

    useEffect(() => {
        if (!localStorage.getItem('TOKEN')) {
            dispatch(updateLoggedInUser());
            nav('/');
        }
        fetch('https://final-boss-back-end.vercel.app/getAllPosts')
            .then(res => res.json()).then(data => {
            dispatch(updateAllPosts(data.data));
        })
    }, []);

    return (
        <>
            <NavBar/>
            <div className="contentPage">
                <div className="postsCont">
                    <div className="sortCont w-100">
                        <SortButtons/>
                        <div className="createPostBtn" onClick={() => setDisplay('block')}>CREATE NEW POST</div>
                    </div>
                    {allPosts.length > 0 && <div className="allPosts">
                        {allPosts.map(post =>
                            <SinglePost key={post._id} post={post}/>
                        )}
                    </div>}
                </div>
                <div className=" usersSideBar">
                    {allUsers.length > 0 ? allUsers.map(user =>
                            <SingleUser key={user._id} user={user}/>
                        ) :
                        <div className="my-3 text-center">There are no other users</div>}
                </div>
            </div>
            <Message_newPost_Modal type={'post'} setDisplay={setDisplay} display={display}/>
        </>
    );
};

export default PostsPage;