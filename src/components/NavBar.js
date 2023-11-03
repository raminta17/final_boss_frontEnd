import React from 'react';
import {NavLink, Link, useNavigate} from "react-router-dom";
import {useSelector} from "react-redux";
import {socket} from "../App";
import {useState} from "react";

const NavBar = () => {

    const nav= useNavigate();
    const loggedInUser = useSelector(state=> state.user.loggedInUser);
    const [navClassNames, setNavClassNames] = useState('nav');

    function handleLogOut() {
        localStorage.removeItem('TOKEN');
        localStorage.removeItem('auto-login');
        socket.disconnect();
        nav('/');
    }
    function handleResponsiveMenu() {
        if (navClassNames === 'nav') {
            setNavClassNames('nav responsive');
        } else {
            setNavClassNames('nav');
        }
    }

    return (
        <div className={navClassNames}>
            {loggedInUser &&
                <div className="mainNav">
                    <Link to="/profile" className="navUserLogo">
                        <img src={loggedInUser.profileImg} alt=""/>
                        {loggedInUser.username}
                    </Link>
                    <div className="burgerMenu" onClick={handleResponsiveMenu}>
                        <i className="fa-solid fa-bars"></i>
                    </div>
                </div>}
            <div className="navLinksDiv h-100">
                <NavLink className="navLinks" to="/posts"><div>POSTS</div></NavLink>
                <NavLink className="navLinks" to="/messages"><div>MESSAGES</div></NavLink>
                <NavLink className="navLinks allUsers" to="/allUsers"><div>USERS</div></NavLink>
            </div>
            <div className="navLinks" onClick={handleLogOut}>LOG OUT</div>
        </div>
    )
        ;
};

export default NavBar;