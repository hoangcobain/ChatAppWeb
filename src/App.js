import React from 'react';
import './App.css';
import Sidebar from './component/Sidebar/Sidebar';
import Chat from './component/MessageChat/Chat';
import Login from './component/LoginForm/Login';

function App() {
    return (
        // BEM naming convention
        <div className="app">
            <div className="app__body">
                <Login />
                {/* Sidebar */}
                {/* <Sidebar /> */}
                {/* Chats */}
                {/* <Chat /> */}
            </div>
        </div>
    );
}

export default App;
