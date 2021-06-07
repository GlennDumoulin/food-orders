// Imports
import React, { useState } from "react";

import {
    UserSignupForm,
    RestSignupForm,
    LoginForm,
} from "../../components/forms";

import "./RegisterLoginPage.scss";

// Page content
export const RegisterLoginPage = ({ children }) => {
    // Define states
    const [formSelector, setFormSelector] = useState("register");
    const [type, setType] = useState("user");

    return (
        <div className="page page--register-login">
            <div className="row">
                <div className="register-login-selector d-md-none">
                    <button
                        type="button"
                        onClick={() => {
                            setFormSelector("register");
                        }}
                        className={
                            formSelector === "register"
                                ? "switch left active"
                                : "switch left"
                        }
                    >
                        Register
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            setFormSelector("login");
                        }}
                        className={
                            formSelector === "login"
                                ? "switch right active"
                                : "switch right"
                        }
                    >
                        Login
                    </button>
                </div>
                <div className="col-12 col-md-6">
                    <div
                        className={
                            formSelector === "register"
                                ? "register show"
                                : "register"
                        }
                    >
                        <div className="form-title d-none d-md-block">
                            <h5 className="highlight">New at FoodOrders</h5>
                        </div>
                        <div className="register-type-selector">
                            <label htmlFor="type">
                                I want to register as...
                            </label>
                            <select
                                name="type"
                                onChange={(ev) => {
                                    setType(ev.target.value);
                                }}
                                value={type}
                            >
                                <option value="user">User</option>
                                <option value="restaurant">Restaurant</option>
                            </select>
                        </div>
                        <div className="divider"></div>
                        {/* Show the signup form based on select value */}
                        {type === "user" && <UserSignupForm />}
                        {type === "restaurant" && <RestSignupForm />}
                    </div>
                </div>
                <div className="col-12 col-md-6">
                    <div
                        className={
                            formSelector === "login" ? "login show" : "login"
                        }
                    >
                        <div className="form-title d-none d-md-block">
                            <h5 className="highlight">
                                Already have an account?
                            </h5>
                        </div>
                        <LoginForm />
                    </div>
                </div>
            </div>
        </div>
    );
};
