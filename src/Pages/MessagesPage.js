import React, {useEffect} from 'react';
import {useNavigate} from "react-router-dom";
import {useDispatch} from "react-redux";
import {updateLoggedInUser} from "../features/user";
import NavBar from "../components/NavBar";

const MessagesPage = () => {
    const nav = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        if(!localStorage.getItem('TOKEN')) {
            dispatch(updateLoggedInUser());
            nav('/');

        }
    }, []);

    return (
        <>
            <NavBar/>
            <div className="page">
                messages page
            </div>
        </>
    );
};

export default MessagesPage;