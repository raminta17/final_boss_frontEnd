import React, {useState} from 'react';
import {useRef} from "react";
import {useNavigate} from "react-router-dom";
import {useDispatch} from "react-redux";
import {updateLoggedInUser} from "../features/user";
import {Link} from "react-router-dom";
import {socket} from "../App";

const Form = () => {

    const usernameRef = useRef();
    const passRef = useRef();
    const repeatPassRef = useRef();
    const autoSaveRef = useRef();
    const [error, setError] = useState();
    const nav = useNavigate();
    const dispatch = useDispatch();
    const passRegex = /(?=.*[A-Z])/;
    const [page, setPage] = useState('Login');

    async function register(e) {
        e.preventDefault();
        if (!usernameRef.current.value) return setError('Note: username cannot be empty')
        if (usernameRef.current.value.length < 4 || usernameRef.current.value.length > 20) return setError('Note: username should be between 4 and 20 characters long.')
        if (!passRef.current.value) return setError('Note: password cannot be empty');
        if (passRef.current.value.length < 4 || passRef.current.value.length > 20) return setError('Note: password should be between 4 and 20 characters long.');
        if (!passRegex.test(passRef.current.value)) return setError('Note: password should have at least one upper case letter.');
        if (passRef.current.value !== repeatPassRef.current.value) return setError('Note: passwords should match');
        const user = {
            username: usernameRef.current.value,
            pass1: passRef.current.value,
            pass2: repeatPassRef.current.value,
        }
        const options = {
            method: 'POST',
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify(user)
        }

        try {
            const res = await fetch('https://final-boss-back-end.vercel.app/register', options);
            const data = await res.json();
            setError(data.message);
            if (!data.error) {
                usernameRef.current.value = '';
                passRef.current.value = '';
                repeatPassRef.current.value = '';
                setError();
                // nav('/');
                setPage('Login');
            }
        } catch (e) {
            console.log('error', e)
        }
    }

    async function login(e) {
        e.preventDefault();
        localStorage.setItem('auto-login', autoSaveRef.current.checked);
        if (!usernameRef.current.value) return setError('Note: username cannot be empty');
        if (!passRef.current.value) return setError('Note: password cannot be empty');
        const user = {
            username: usernameRef.current.value,
            password: passRef.current.value,
        }
        const options = {
            method: 'POST',
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify(user)
        }
        try {
            const res = await fetch('https://final-boss-back-end.vercel.app/login', options);
            const data = await res.json();
            setError(data.message);
            if (!data.error) {
                localStorage.setItem('TOKEN', data.data.token);
                dispatch(updateLoggedInUser(data.data.findUser))
                usernameRef.current.value = '';
                passRef.current.value = '';
                setError();
                nav('/posts');
                socket.auth = {
                    token: localStorage.getItem('TOKEN')
                }
                socket.connect();
            }
        } catch (e) {
            console.log('error', e)
        }
    }

    function handleAutoSave() {
        localStorage.setItem('auto-login', autoSaveRef.current.checked);
    }

    return (
        <div className="f1">
            <form className="box form" onSubmit={page === 'Register' ? register : login}>
                <h1>{page}</h1>
                <div className="error">{error}</div>
                <input type="text" ref={usernameRef} placeholder="Your username"/>
                <input type="password" ref={passRef} placeholder="Your password"/>
                {page === 'Register' &&
                    <>
                        <input type="password" ref={repeatPassRef} placeholder="Repeat password"/>
                    </>
                }
                {page === 'Login' ?
                    <>
                        <div className="d-flex w-100 justify-content-center gap-2">
                            <label htmlFor="auto">Stay connected? </label>
                            <input onChange={handleAutoSave} id="auto" type="checkbox" ref={autoSaveRef}/>
                        </div>
                        <div>Do not have an account? <span className="formSpan"
                                                           onClick={() => {
                                                               setPage('Register');
                                                               setError();
                                                               usernameRef.current.value = '';
                                                               passRef.current.value = '';
                                                           }}>Register</span></div>
                    </>
                    :
                    <div>Already have an account? <span className="formSpan"
                                                        onClick={() => {
                                                            setPage('Login');
                                                            setError();
                                                            usernameRef.current.value = '';
                                                            passRef.current.value = '';
                                                        }}>Login</span></div>
                }
                <button>{page}</button>
            </form>
        </div>

    );
};

export default Form;