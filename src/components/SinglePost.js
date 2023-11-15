import React, {useState} from 'react';
import SinglePostModal from "./SinglePostModal";
import {useDispatch} from "react-redux";
import {updateOpenPost} from "../features/user";

const SinglePost = ({post}) => {

    const dispatch = useDispatch();
    const [display, setDisplay] = useState('none');
    const [author, setAuthor] = useState();
    let time = null;

    function formatTimestamp() {
        const currentTime = Date.now();
        time = currentTime - post.time;
        const minute = 1000 * 60;
        const hour = minute * 60;
        const day = hour * 24;
        const year = day * 365;
        if (Math.round(time / 1000) < 60) return time = Math.round(time / 1000) + 's ago';
        if (Math.round(time / minute) < 60) return time = Math.round(time / minute) + 'min ago';
        if (Math.round(time / hour) < 24) return time = Math.round(time / hour) + 'h ago';
        if (Math.round(time / day) < 24) return time = Math.round(time / day) + ' days ago';
        if (Math.round(time / year) < 24) return time = Math.round(time / year) + ' years ago';
    }

    formatTimestamp();

    async function openModal() {
        setDisplay('block');
        dispatch(updateOpenPost(post));
        try {
            const res = await fetch('https://final-boss-back-end.vercel.app/getPostAuthor/' + post.authorId);
            const data = await res.json();
            setAuthor(data.data);
        } catch (e) {
            console.log('error fetching author info', e)
        }
    }

    return (
        <div className={display === 'none' ? "box singlePost" : 'box'}>
            <div className="w-100 text-center d-flex flex-column gap-1" onClick={openModal}>
                <div className="wordBreak postTitle">
                    {post.title}
                </div>
                <div className="postImage">
                    <img src={post.image} alt=""/>
                </div>
                <div className="d-flex w-100 justify-content-between align-items-center">
                    <div className="date">{time}</div>
                    <div className="d-flex gap-3">
                        <div className="d-flex gap-2 align-items-center"><i
                            className="fa-solid fa-thumbs-up"></i>{post.likes.length}</div>
                        <div className="d-flex gap-2 align-items-center"><i
                            className="fa-solid fa-comment"></i>{post.comments.length}</div>
                    </div>

                </div>
            </div>
            <SinglePostModal author={author} time={time} setDisplay={setDisplay} display={display}/>
        </div>
    );
};

export default SinglePost;