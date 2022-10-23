import React, { useEffect, useState } from 'react';
import './App.css';
import Sidebar from './component/Sidebar/Sidebar';
import Chat from './component/MessageChat/Chat';
import Login from './component/LoginForm/Login';
import Amplify from 'aws-amplify';
import awsExports from './aws-exports';
import { withAuthenticator } from '@aws-amplify/ui-react';
import { Auth, Hub } from 'aws-amplify';
import '@aws-amplify/ui-react/styles.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

Amplify.configure(awsExports);

function App() {
    const [currentUser, setCurrentUser] = useState('');

    // useEffect(() => {
    //     Hub.listen('auth', (event) => {
    //         console.log(event);
    //         setCurrentUser(event.payload.data);
    //     });
    // });

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
                <Router>
                    <Sidebar />
                    <Switch>
                        <Route path="/rooms/:roomId">
                            <Chat />
                        </Route>
                        <Route path="/">
                            <Chat />
                        </Route>
                    </Switch>
                </Router>

                {/* <button onClick={logOut}>Log out</button> */}
            </div>
        </div>
    );
}

export default withAuthenticator(App);
