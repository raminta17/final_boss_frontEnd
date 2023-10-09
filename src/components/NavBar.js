import React from 'react';
import {NavLink, Link, useNavigate} from "react-router-dom";
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
            {loggedInUser && <Link to="/profile" className="navUserLogo">
                <img src={loggedInUser.profileImg} alt=""/>
                {loggedInUser.username}
            </Link>}
            <div className="d-flex gap-4 h-100">
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