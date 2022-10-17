import React, { useEffect, useState, Route, Routes } from 'react';
import './App.css';
import Sidebar from './component/Sidebar/Sidebar';
import Chat from './component/MessageChat/Chat';
import Login from './component/LoginForm/Login';
import Amplify from 'aws-amplify';
import { withAuthenticator } from '@aws-amplify/ui-react';
import awsExports from './aws-exports';
// import { withAuthenticator } from '@aws-amplify/ui-react';
import { Auth, Hub } from 'aws-amplify';
import '@aws-amplify/ui-react/styles.css';

Amplify.configure(awsExports);

function App() {
    const [currentUser, setCurrentUser] = useState('');

    useEffect(() => {
        Hub.listen('auth', (event) => {
            console.log(event);
            setCurrentUser(event.payload.data);
        });
    });

    return (
        // BEM naming convention
        <div className="app">
            <div className="app__body">
                {/* {currentUser ? (
                    <React.Fragment>
                        <Sidebar />
                        <Chat />
                    </React.Fragment>
                ) : (
                    <Login />
                )} */}
                {/* Sidebar */}
                <Sidebar />
                {/* Chats */}
                <Chat />
                {/* <button onClick={logOut}>Log out</button> */}
            </div>
        </div>
    );
}

export default withAuthenticator(App);
