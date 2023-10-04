import React from 'react';

const SingleUser = ({user}) => {
    return (
        <div className="box singleUser">
            <div className="navUserLogo">
                <img src={user.profileImg} alt=""/>
                <b>{user.username}</b>
                <button>WRITE A MESSAGE</button>
            </div>
        </div>
    );
};

export default SingleUser;