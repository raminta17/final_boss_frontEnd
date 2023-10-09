import React, {useEffect} from 'react';
import Form from "../components/Form";

const StartPage = () => {


    return (
        <div className="page startPage">
                <header className="f1 text-center text-md-end d-flex flex-column justify-content-center">
                    <h1>WELCOME TO</h1>
                    <h2>YouCONNECT</h2>
                    <h4>Share and chat online.</h4>
                </header>
                <Form />
        </div>
    );
};

export default StartPage;