import './App.css';
import {io} from 'socket.io-client';
import {Routes, Route} from "react-router-dom";
import LoginPage from "./Pages/LoginPage";
import RegisterPage from "./Pages/RegistrationPage";
import ProfilePage from "./Pages/ProfilePage";
import MessagesPage from "./Pages/MessagesPage";
import PostsPage from "./Pages/PostsPage";
import AllUsersPage from "./Pages/AllUsersPage";
import {useEffect} from "react";
import {useDispatch} from "react-redux";
import {updateAllUsers} from "./features/user";

export const socket = io('http://localhost:8000', {
    autoConnect: false
});

function App() {

    const dispatch = useDispatch();

    useEffect(() => {
        if((localStorage.getItem('TOKEN'))){
            socket.auth = {
                token: localStorage.getItem('TOKEN')
            }
            socket.connect();
            socket.on('msg', msg => {
                console.log(msg)
            })
        }
        socket.on('sendingAllUsers', data => {
            console.log('all users from sockets',data);
            dispatch(updateAllUsers(data));
        })
    }, []);

    window.addEventListener('beforeunload', (e) => {
        e.preventDefault();
        if(!JSON.parse(localStorage.getItem('auto-login'))) {
            socket.disconnect();
            return localStorage.removeItem('TOKEN')
        }
    })
  return (
    <div>
        <Routes>
            <Route path="/" element={<LoginPage/>}/>
            <Route path="/register" element={<RegisterPage/>}/>
            <Route path="/profile" element={<ProfilePage/>}/>
            <Route path="/messages" element={<MessagesPage/>}/>
            <Route path="/posts" element={<PostsPage/>}/>
            <Route path="/allUsers" element={<AllUsersPage/>}/>
        </Routes>
    </div>
  );
}

export default App;
