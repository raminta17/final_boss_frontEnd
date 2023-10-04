import React from 'react';
import {NavLink, useNavigate} from "react-router-dom";
import {useSelector} from "react-redux";
import {socket} from "../App";
const NavBar = () => {

    const nav= useNavigate();
    const loggedInUser = useSelector(state=> state.user.loggedInUser);

    function handleLogOut() {
        localStorage.removeItem('TOKEN');
        localStorage.removeItem('auto-login');
        socket.disconnect();
        nav('/');
    }

    return (
        <div className="nav">
            {loggedInUser && <div className="navUserLogo">
                <img src={loggedInUser.profileImg} alt=""/>
                {loggedInUser.username}
            </div>}
            <div className="d-flex gap-4 h-100">
                <NavLink className="navLinks" to="/profile"><div>PROFILE</div></NavLink>
                <NavLink className="navLinks" to="/messages"><div>MESSAGES</div></NavLink>
                <NavLink className="navLinks" to="/posts"><div>POSTS</div></NavLink>
                <NavLink className="navLinks" to="/allUsers"><div>USERS</div></NavLink>
            </div>
            <div  className="navLinks" onClick={handleLogOut}>LOG OUT</div>
        </div>
    )
        ;
};

export default NavBar;