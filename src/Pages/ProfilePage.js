import React, {useEffect, useRef, useState} from 'react';
import NavBar from "../components/NavBar";
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {updateLoggedInUser, updateImg} from "../features/user";
import {socket} from "../App";
import button from "bootstrap/js/src/button";

const ProfilePage = () => {

    const imgRef = useRef();
    const oldPassRef = useRef();
    const newPassRef = useRef();
    const repeatNewPassRef = useRef();
    const nav = useNavigate();
    const dispatch = useDispatch();
    const loggedInUser = useSelector(state => state.user.loggedInUser);
    const passRegex = /(?=.*[A-Z])/;
    const [displayPhoto, setDisplayPhoto] = useState('none');
    const [displayPass, setDisplayPass] = useState('none');
    const [error, setError] = useState();

    useEffect(() => {
        if (!localStorage.getItem('TOKEN')) {
            dispatch(updateLoggedInUser());
            nav('/');
        }
    }, []);

    async function updateProfileImg(e) {
        e.preventDefault();
        if (!imgRef.current.value) return setError('Note: you have to provide new photo url.')
        socket.emit('updatePhoto', imgRef.current.value);
        dispatch(updateImg(imgRef.current.value));
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
            const res = await fetch('http://final-boss-back-end.vercel.app/changePassword', options);
            const data = await res.json();
            setError(data.message);
            if (!data.error) {
                oldPassRef.current.value = '';
                newPassRef.current.value = '';
                repeatNewPassRef.current.value = '';
                setDisplayPass('none');
                setError();
                nav('/');
                localStorage.removeItem('TOKEN');
                socket.disconnect();
            }
        } catch (e) {
            console.log('error fetching front end', e)
        }
    }

    return (
        <>
            <NavBar/>
            {loggedInUser &&
                <div className="profilePage">
                    <div className="box profileBox flex-wrap">
                        <div className="d-flex flex-column gap-2 f1">
                            <div className="profileImgDiv">
                                <img src={loggedInUser.profileImg} alt=""/>
                            </div>
                        </div>
                        <div className="d-flex flex-column f1 w-100 gap-4">
                            <h2 className="border-bottom border-secondary pb-2">{loggedInUser.username}</h2>
                            <div className="d-flex flex-column gap-4">
                                {displayPhoto === 'none' ?
                                    <button onClick={() => setDisplayPhoto('flex')}>Change photo</button>
                                    :
                                    <form onSubmit={updateProfileImg} style={{display: displayPhoto}}
                                          className="flex-column gap-2">
                                        <div className="w-100 position-relative">
                                            <input className="w-100" type="url" ref={imgRef}
                                                   placeholder="Your new profile picture url"/>
                                            <i onClick={() => setDisplayPhoto('none')}
                                               className="fa-regular fa-circle-xmark position-absolute close"></i>
                                        </div>
                                        <button>Update photo</button>
                                    </form>}
                            </div>
                            {displayPass === 'none' ?
                                <button onClick={() => setDisplayPass('flex')}>Change Password</button>
                                :
                                <form onSubmit={changePassword} style={{display: displayPass}}
                                      className="flex-column gap-2">
                                    <div className="w-100 position-relative">
                                        <input className="w-100" type="password" ref={oldPassRef}
                                               placeholder="old password"/>
                                        <i onClick={() => setDisplayPass('none')}
                                           className="fa-regular fa-circle-xmark position-absolute close"></i>
                                    </div>
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