import React, {useEffect, useState} from 'react';
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {updateLoggedInUser, updateAllPosts, updateActivePostSort} from "../features/user";
import NavBar from "../components/NavBar";
import Message_newPost_Modal from "../components/Message_newPost_Modal";
import SinglePost from "../components/SinglePost";

const PostsPage = () => {
    const nav = useNavigate();
    const dispatch = useDispatch();
    const [display, setDisplay] = useState('none');
    let allPosts = useSelector(state=>state.user.allPosts);
    const [sortMostComments, setSortMostComments] = useState(false);
    const [sortMostLikes, setSortMostLikes] = useState(false);
    const [sortOldest, setSortOldest] = useState(false);

    useEffect(() => {
        if(!localStorage.getItem('TOKEN')) {
            dispatch(updateLoggedInUser());
            nav('/');
        }
        fetch('http://localhost:8000/getAllPosts' )
            .then(res=>res.json()).then(data=> {
            dispatch(updateAllPosts(data.data));
        })
    }, []);

    function handleCommentSort() {
        if(sortMostComments) {
            allPosts = allPosts.slice().sort((post1,post2) => (post2.comments.length - post1.comments.length));
            dispatch(updateActivePostSort('mostComments'))
        }else {
            allPosts = allPosts.slice().sort((post1,post2) => (post1.comments.length - post2.comments.length));
            dispatch(updateActivePostSort('leastComments'))
        }
        dispatch(updateAllPosts(allPosts));
        setSortMostComments(!sortMostComments);
    }
    function handleLikesSort() {
        if(sortMostLikes) {
            allPosts = allPosts.slice().sort((post1,post2) => (post2.likes.length - post1.likes.length));
            dispatch(updateActivePostSort('mostLikes'))
        }else {
            allPosts = allPosts.slice().sort((post1,post2) => (post1.likes.length - post2.likes.length));
            dispatch(updateActivePostSort('leastLikes'))
        }
        dispatch(updateAllPosts(allPosts));
        setSortMostLikes(!sortMostLikes);
    }
    function handleTimeSort() {
        if(sortOldest) {
            allPosts = allPosts.slice().sort((post1,post2) => (post1.time - post2.time));
            dispatch(updateActivePostSort('oldest'))
        }else {
            allPosts = allPosts.slice().sort((post1,post2) => (post2.time - post1.time));
            dispatch(updateActivePostSort('newest'))
        }
        dispatch(updateAllPosts(allPosts));
        setSortOldest(!sortOldest);
    }

    return (
        <>
            <NavBar/>
            <div className="contentPage flex-column">
                <div className="d-flex justify-content-between w-100 gap-4 align-items-center">
                    <div>SORT BY:</div>
                    <div className="sortBtn" onClick={handleCommentSort}>
                        <div className={sortMostComments ? 'sortInactive' : ''}>MOST COMMENTS</div>
                        <div className={sortMostComments ? '' : 'sortInactive'}>LEAST COMMENTS</div>
                    </div>
                    <div className="sortBtn" onClick={handleLikesSort}>
                        <div  className={sortMostLikes ? 'sortInactive' : ''}>MOST LIKES</div>
                        <div  className={sortMostLikes ? '' : 'sortInactive'}>LEAST LIKES</div>
                    </div>
                    <div className="sortBtn" onClick={handleTimeSort}>
                        <div  className={sortOldest ? 'sortInactive' : ''}>OLDEST</div>
                        <div  className={sortOldest ? '' : 'sortInactive'}>NEWEST</div>
                    </div>
                    <div className="createPostBtn" onClick={()=> setDisplay('block')}>CREATE NEW POST</div>
                </div>

                {allPosts.length> 0 && <div className="allPosts">
                    {allPosts.map(post =>
                        <SinglePost key={post._id} post={post}/>
                    )}
                </div>}
                <Message_newPost_Modal type={'post'} setDisplay={setDisplay} display={display}/>
            </div>
        </>
    );
};

export default PostsPage;