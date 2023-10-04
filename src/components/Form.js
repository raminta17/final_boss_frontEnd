import React, {useState} from 'react';
import {useRef} from "react";
import {useNavigate} from "react-router-dom";
import {useDispatch} from "react-redux";
import {updateLoggedInUser} from "../features/user";
import {Link} from "react-router-dom";
import {socket} from "../App";

const Form = ({page}) => {

    const usernameRef = useRef();
    const passRef = useRef();
    const repeatPassRef = useRef();
    const autoSaveRef = useRef();
    const [error, setError] = useState();
    const nav = useNavigate();
    const dispatch = useDispatch();

    const passRegex = /(?=.*[A-Z])/;

    async function register(e) {
        e.preventDefault();
        if (!usernameRef.current.value) return setError('Username cannot be empty')
        if (usernameRef.current.value.length <4 || usernameRef.current.value.length >20) return setError('Username should be between 4 and 20 characters long.')
        if (!passRef.current.value) return setError('Password cannot be empty');
        if (passRef.current.value.length <4 || passRef.current.value.length >20) return setError('Password should be between 4 and 20 characters long.');
        if(!passRegex.test(passRef.current.value)) return setError('Password should have at least one upper case letter.');
        if (passRef.current.value !== repeatPassRef.current.value) return setError('Passwords should match');
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
            const res = await fetch('http://localhost:8000/register', options);
            const data = await res.json();
            console.log('data', data);
            setError(data.message);
            if (!data.error) {
                usernameRef.current.value = '';
                passRef.current.value = '';
                repeatPassRef.current.value = '';
                setError();
                nav('/');
            }
        } catch (e) {
            console.log('error', e)
        }
    }

    async function login(e) {
        e.preventDefault();
        localStorage.setItem('auto-login', autoSaveRef.current.checked);
        if (!usernameRef.current.value) return setError('username cannot be empty');
        if (!passRef.current.value) return setError('password cannot be empty');
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
            const res = await fetch('http://localhost:8000/login', options);
            const data = await res.json();
            console.log(data);
            setError(data.message);
            if (!data.error) {
                localStorage.setItem('TOKEN', data.data.token);
                dispatch(updateLoggedInUser(data.data.findUser))
                usernameRef.current.value = '';
                passRef.current.value = '';
                setError();
                nav('/profile');
                // socket.auth = {
                //     token: localStorage.getItem('TOKEN')
                // }
                // socket.connect();
                socket.emit('userConnected');
            }
        } catch (e) {
            console.log('error', e)
        }
    }

    function handleAutoSave() {
        localStorage.setItem('auto-login', autoSaveRef.current.checked);
    }

    return (

            <form  className="box" onSubmit={page === 'Register' ? register : login}>
                <h1>{page}</h1>
                {error && <div className="error">{error}</div>}
                <input type="text" ref={usernameRef} defaultValue="User" placeholder="Your username"/>
                <input type="text" ref={passRef} defaultValue="Labas" placeholder="Your password"/>
                {page === 'Register' &&
                    <>
                        <input type="text" ref={repeatPassRef} placeholder="Repeat password"/>

                    </>
                }
                {page === 'Login' ?
                    <>
                        <div>
                            <label htmlFor="auto">Stay logged in? </label>
                            <input onChange={handleAutoSave} id="auto" type="checkbox" ref={autoSaveRef}/>
                        </div>
                        <div>Do not have an account? <Link to="/register">Register</Link></div>
                    </>
                :
                    <div>Already have an account? <Link to="/">Login</Link></div>
                }
                <button>{page}</button>
            </form>
    );
};

export default Form;