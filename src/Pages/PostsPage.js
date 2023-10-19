import React, {useEffect, useState} from 'react';
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {updateLoggedInUser, updateAllPosts, updateActivePostSort} from "../features/user";
import NavBar from "../components/NavBar";
import Message_newPost_Modal from "../components/Message_newPost_Modal";
import SinglePost from "../components/SinglePost";
import SingleUser from "../components/SingleUser";

const PostsPage = () => {
    const nav = useNavigate();
    const dispatch = useDispatch();
    const [display, setDisplay] = useState('none');
    let allPosts = useSelector(state=>state.user.allPosts);
    const allUsers = useSelector(state=>state.user.allUsers);
    const [sortMostComments, setSortMostComments] = useState(false);
    const [sortMostLikes, setSortMostLikes] = useState(false);
    const [sortOldest, setSortOldest] = useState(false);
    const selectedSort = useSelector(state=>state.user.activePostSort);

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
            <div className="contentPage">
                <div className="postsCont">
                    <div className="sortCont w-100">
                        <div className="d-flex gap-2 align-items-center flex-wrap justify-content-center small">
                            <div>SORT BY:</div>
                            <div className="d-flex gap-2 flex-wrap justify-content-center">
                                <div className="sortBtn" onClick={handleCommentSort}>
                                    <div className={selectedSort==='mostComments' || selectedSort==='leastComments' ? 'selectedSort gap-2' : 'gap-2'}>
                                        <div>COMMENTS</div>
                                        {selectedSort==='mostComments'
                                            ?
                                            <i className="fa-solid fa-chevron-up"></i>
                                            :
                                            <i className="fa-solid fa-chevron-down"></i>}
                                    </div>
                                </div>
                                <div className="sortBtn" onClick={handleLikesSort}>
                                    <div  className={selectedSort==='mostLikes' || selectedSort==='leastLikes' ? 'selectedSort gap-2' : 'gap-2'}>
                                        LIKES
                                        {selectedSort==='mostLikes'
                                            ?
                                            <i className="fa-solid fa-chevron-up"></i>
                                            :
                                            <i className="fa-solid fa-chevron-down"></i>}
                                    </div>
                                </div>
                                <div className="sortBtn" onClick={handleTimeSort}>
                                    <div  className={selectedSort==='oldest' || selectedSort==='newest'? 'selectedSort gap-2' : 'gap-2'}>
                                        {/*TIME*/}
                                        {selectedSort==='oldest'
                                            ?
                                            <div>OLDEST
                                                {/*<i className="fa-solid fa-chevron-up"></i>*/}
                                            </div>
                                            :
                                            <div>NEWEST
                                                {/*<i className="fa-solid fa-chevron-down"></i>*/}
                                            </div>}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="createPostBtn" onClick={()=> setDisplay('block')}>CREATE NEW POST</div>
                    </div>
                    {allPosts.length> 0 && <div className="allPosts">
                        {allPosts.map(post =>
                            <SinglePost key={post._id} post={post}/>
                        )}
                    </div>}
                </div>
                <div className=" usersSideBar">
                    {allUsers.map(user =>
                        <SingleUser key={user._id} user={user}/>
                    )}
                </div>
                <Message_newPost_Modal type={'post'} setDisplay={setDisplay} display={display}/>
            </div>
        </>
    );
};

export default PostsPage;