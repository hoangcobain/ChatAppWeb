import './Login.css';

import React from 'react';

export default function Login() {
    return (
        <div className="container">
            <div className="background"></div>
            <div className="aside">
                <div className="aside__form">
                    <h3 className="aside__title">Chat application</h3>
                    <form action="/" method="post" className="form">
                        <input placeholder="username" name="username" className="form__input" />
                        <input type={'password'} placeholder="password" name="password" className="form__input" />
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
