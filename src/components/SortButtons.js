import React, {useState} from 'react';
import {updateActivePostSort, updateAllPosts} from "../features/user";
import {useDispatch, useSelector} from "react-redux";

const SortButtons = () => {

    const dispatch = useDispatch();
    const [sortMostComments, setSortMostComments] = useState(false);
    const [sortMostLikes, setSortMostLikes] = useState(false);
    const [sortOldest, setSortOldest] = useState(true);
    const selectedSort = useSelector(state => state.user.activePostSort);
    let allPosts = useSelector(state => state.user.allPosts);


    function handleCommentSort() {
        if (sortMostComments) {
            allPosts = allPosts.slice().sort((post1, post2) => (post2.comments.length - post1.comments.length));
            dispatch(updateActivePostSort('mostComments'))
        } else {
            allPosts = allPosts.slice().sort((post1, post2) => (post1.comments.length - post2.comments.length));
            dispatch(updateActivePostSort('leastComments'))
        }
        dispatch(updateAllPosts(allPosts));
        setSortMostComments(!sortMostComments);
    }

    function handleLikesSort() {
        if (sortMostLikes) {
            allPosts = allPosts.slice().sort((post1, post2) => (post2.likes.length - post1.likes.length));
            dispatch(updateActivePostSort('mostLikes'))
        } else {
            allPosts = allPosts.slice().sort((post1, post2) => (post1.likes.length - post2.likes.length));
            dispatch(updateActivePostSort('leastLikes'))
        }
        dispatch(updateAllPosts(allPosts));
        setSortMostLikes(!sortMostLikes);
    }

    function handleTimeSort() {
        if (sortOldest) {
            allPosts = allPosts.slice().sort((post1, post2) => (post1.time - post2.time));
            dispatch(updateActivePostSort('oldest'))
        } else {
            allPosts = allPosts.slice().sort((post1, post2) => (post2.time - post1.time));
            dispatch(updateActivePostSort('newest'))
        }
        dispatch(updateAllPosts(allPosts));
        setSortOldest(!sortOldest);
    }

    return (
        <div className="d-flex gap-2 align-items-center flex-wrap justify-content-center small">
            <div>SORT BY:</div>
            <div className="d-flex gap-2 flex-wrap justify-content-center">
                <div className="sortBtn" onClick={handleCommentSort}>
                    <div
                        className={selectedSort === 'mostComments' || selectedSort === 'leastComments' ? 'selectedSort gap-2' : 'gap-2'}>
                        <div>COMMENTS</div>
                        {selectedSort === 'mostComments'
                            ?
                            <i className="fa-solid fa-chevron-up"></i>
                            :
                            <i className="fa-solid fa-chevron-down"></i>}
                    </div>
                </div>
                <div className="sortBtn" onClick={handleLikesSort}>
                    <div
                        className={selectedSort === 'mostLikes' || selectedSort === 'leastLikes' ? 'selectedSort gap-2' : 'gap-2'}>
                        LIKES
                        {selectedSort === 'mostLikes'
                            ?
                            <i className="fa-solid fa-chevron-up"></i>
                            :
                            <i className="fa-solid fa-chevron-down"></i>}
                    </div>
                </div>
                <div className="sortBtn" onClick={handleTimeSort}>
                    <div
                        className={selectedSort === 'oldest' || selectedSort === 'newest' ? 'selectedSort gap-2' : 'gap-2'}>
                        {selectedSort === 'oldest'
                            ?
                            <div>OLDEST</div>
                            :
                            <div>NEWEST</div>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SortButtons;