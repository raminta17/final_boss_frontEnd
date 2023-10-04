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
        } else {
            const options = {
                method: 'GET',
                headers: {
                    'content-type': 'application/json',
                    authorization: localStorage.getItem('TOKEN')
                }
            }
            fetch('http://localhost:8000/getUserInfo', options)
                .then(res => res.json()).then(data => {
                dispatch(updateLoggedInUser(data.data))
            })
        }
    }, []);

    async function updateProfileImg() {
        console.log(imgRef.current.value)
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
            console.log(data);
            dispatch(updateImg(data.data));
        } catch (e) {
            console.log('error fetching front end', e)
        }
    }

    async function changePassword(e) {
        e.preventDefault();
        console.log(oldPassRef.current.value)
        console.log(newPassRef.current.value)
        console.log(repeatNewPassRef.current.value)
        if (!oldPassRef.current.value) return setError('password cannot be empty');
        if (!newPassRef.current.value) return setError('password cannot be empty');
        if (newPassRef.current.value.length < 4 || newPassRef.current.value.length > 20) return setError('Password should be between 4 and 20 characters long.');
        if (!passRegex.test(newPassRef.current.value)) return setError('Password should have at least one upper case letter.');
        if (newPassRef.current.value !== repeatNewPassRef.current.value) return setError('Passwords should match');
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
            console.log(data);
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
                <div className="page">
                    <div className="box profileBox">
                        <div className="d-flex flex-column align-items-center
                        gap-2 f1">
                            <div className="profileImgDiv">
                                <img src={loggedInUser.profileImg} alt=""/>
                            </div>
                            <div>
                                <input type="text" ref={imgRef} placeholder="Your new profile picture url"/>
                                <button onClick={updateProfileImg}>Update</button>
                            </div>
                        </div>
                        <div className="d-flex flex-column f1">
                            <div>{loggedInUser.username}</div>
                            {display === 'none' ?
                                <button onClick={() => setDisplay('flex')}>Change Password</button>
                                :
                                <form onSubmit={changePassword} style={{display: display}} className="flex-column">
                                    <div>{error}</div>
                                    <input type="text" ref={oldPassRef} placeholder="old password"/>
                                    <input type="text" ref={newPassRef} placeholder="new password"/>
                                    <input type="text" ref={repeatNewPassRef} placeholder="repeat new password"/>
                                    <button>change password</button>
                                </form>}
                        </div>
                    </div>
                </div>
            }

        </>

    );
};

export default ProfilePage;