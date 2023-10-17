import React, {useEffect, useRef, useState} from 'react';
import NavBar from "../components/NavBar";
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {updateLoggedInUser, updateImg} from "../features/user";
import {socket} from "../App";
const ProfilePage = () => {

    const imgRef = useRef();
    const oldPassRef = useRef();
    const newPassRef = useRef();
    const repeatNewPassRef = useRef();
    const nav = useNavigate();
    const dispatch = useDispatch();
    const loggedInUser = useSelector(state => state.user.loggedInUser);
    const passRegex = /(?=.*[A-Z])/;
    const [display, setDisplay] = useState('none');
    const [error, setError] = useState();

    useEffect(() => {
        if (!localStorage.getItem('TOKEN')) {
            dispatch(updateLoggedInUser());
            nav('/');
        }
    }, []);

    async function updateProfileImg() {
        if(!imgRef.current.value) return setError('Note: you have to provide new photo url.')
        const options = {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                authorization: localStorage.getItem('TOKEN')
            },
            body: JSON.stringify({newImg: imgRef.current.value})
        }
        try {
            const res = await fetch('http://localhost:8000/updateImg', options);
            const data = await res.json();
            dispatch(updateImg(data.data));
        } catch (e) {
            console.log('error fetching front end', e)
        }
        imgRef.current.value = "";
        setError();
    }

    async function changePassword(e) {
        e.preventDefault();
        if (!oldPassRef.current.value) return setError('Note: password cannot be empty');
        if (!newPassRef.current.value) return setError('Note: password cannot be empty');
        if (newPassRef.current.value.length < 4 || newPassRef.current.value.length > 20) return setError('Note: password should be between 4 and 20 characters long.');
        if (!passRegex.test(newPassRef.current.value)) return setError('Note: password should have at least one upper case letter.');
        if (newPassRef.current.value !== repeatNewPassRef.current.value) return setError('Note: passwords should match');
        const passChangeObj = {
            oldPass: oldPassRef.current.value,
            newPass: newPassRef.current.value,
            repeatNewPass: repeatNewPassRef.current.value
        }
        const options = {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                authorization: localStorage.getItem('TOKEN')
            },
            body: JSON.stringify(passChangeObj)
        }
        try {
            const res = await fetch('http://localhost:8000/changePassword', options);
            const data = await res.json();
            setError(data.message);
            if (!data.error) {
                oldPassRef.current.value = '';
                newPassRef.current.value = '';
                repeatNewPassRef.current.value = '';
                setDisplay('none');
                setError();
                nav('/');
                localStorage.removeItem('TOKEN');
            }
        } catch (e) {
            console.log('error fetching front end', e)
        }
    }

    return (
        <>
            <NavBar/>
            {loggedInUser &&
                <div className="profilePage contentPage">
                    <div className="box profileBox flex-wrap">
                        <div className="d-flex flex-column gap-2 f1">
                            <div className="profileImgDiv">
                                <img src={loggedInUser.profileImg} alt=""/>
                            </div>
                            <h3>{loggedInUser.username}</h3>
                        </div>
                        <div className="d-flex flex-column f1 gap-4 w-100">
                            <h5>Update your profile</h5>
                            <div className="d-flex flex-column gap-4">
                                <input type="text" ref={imgRef} placeholder="Your new profile picture url"/>
                                <button onClick={updateProfileImg}>Update photo</button>
                            </div>
                            {display === 'none' ?
                                <button onClick={() => setDisplay('flex')}>Change Password</button>
                                :
                                <form onSubmit={changePassword} style={{display: display}} className="flex-column gap-2">
                                    <input type="password" ref={oldPassRef} placeholder="old password"/>
                                    <input type="password" ref={newPassRef} placeholder="new password"/>
                                    <input type="password" ref={repeatNewPassRef} placeholder="repeat new password"/>
                                    <button>Change password</button>
                                </form>}
                            <div className="error">{error}</div>
                        </div>
                    </div>
                </div>
            }

        </>

    );
};

export default ProfilePage;