import React, {useState} from 'react';
import SinglePostModal from "./SinglePostModal";
import {useDispatch} from "react-redux";
import {updateOpenPost} from "../features/user";

const SinglePost = ({post}) => {

    const dispatch = useDispatch();
    const [display, setDisplay] = useState('none');
    const [author, setAuthor]= useState();

   async  function openModal() {
        setDisplay('block');
        dispatch(updateOpenPost(post));

       try {
           const res = await fetch('http://localhost:8000/getPostAuthor/' + post.authorId);
           const data = await res.json();
           setAuthor(data.data);
       } catch(e) {
           console.log('error fetching author info', e)
       }

    }

    return (
        <div className={display==='none' ? "box singlePost" : 'box'}>
            <div className="w-100 text-center d-flex flex-column gap-1" onClick={openModal}>
                <div>
                    {post.title}
                </div>
                <div className="postImage">
                    <img src={post.image} alt=""/>
                </div>
                <div className="d-flex w-100 justify-content-end gap-3 align-items-center">
                    <div><i className="fa-solid fa-thumbs-up"></i>{post.likes.length}</div>
                    <div><i className="fa-solid fa-comment"></i>{post.comments.length}</div>
                </div>
            </div>

            <SinglePostModal author={author} setDisplay={setDisplay} display={display}/>
        </div>
    );
};

export default SinglePost;