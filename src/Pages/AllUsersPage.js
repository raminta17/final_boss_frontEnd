import React, {useEffect} from 'react';
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {updateLoggedInUser} from "../features/user";
import NavBar from "../components/NavBar";
import {socket} from "../App";
import SingleUser from "../components/SingleUser";

const AllUsersPage = () => {

    const nav = useNavigate();
    const dispatch = useDispatch();
    const allUsers = useSelector(state=>state.user.allUsers);

    useEffect(() => {
        if(!localStorage.getItem('TOKEN')) {
            dispatch(updateLoggedInUser());
            nav('/');
        }
    }, []);

    return (
        <>
            <NavBar/>
            <div className="contentPage allUsersPage">
                {allUsers.map(user =>
                    <SingleUser key={user._id} user={user}/>
                )}
            </div>
        </>
    );
};

export default AllUsersPage;