import './Login.css';

import React, { useState } from 'react';
import { Auth } from 'aws-amplify';
export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmitFuntion = async (event) => {
        event.preventDefault();
        const respone = await Auth.signIn(email, password);
    };
    return (
        <div className="container">
            <div className="background"></div>
            <div className="aside">
                <div className="aside__form">
                    <h3 className="aside__title">Chat application</h3>
                    <form className="form" onSubmit={handleSubmitFuntion} action="/">
                        <input
                            placeholder="username"
                            name="email"
                            className="form__input"
                            onChange={(username) => setEmail(username.target.value)}
                            // value={email}
                        />
                        <input
                            type={'password'}
                            placeholder="password"
                            name="password"
                            className="form__input"
                            onChange={(password) => setPassword(password.target.value)}
                            // value={password}
                        />
                        <input type={'submit'} value="Login" className="form__btn" />
                    </form>
                    <a href="#" className="aside_forgot">
                        Forgot password?
                    </a>
                    <p>
                        If you don't have an account?
                        <span>
                            <a href="#" className="aside_signup">
                                Please Sign up!
                            </a>
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
}
