// Imports
import React, { useState } from "react";

import { UserSignupForm, RestSignupForm } from "../../components/forms";

import "./RegisterLoginPage.scss";

// Page content
export const RegisterLoginPage = ({ children }) => {
    // Define state
    const [type, setType] = useState("user");

    return (
        <div className="page page--register-login">
            <h1>Register/Login</h1>
            <div className="register">
                <label htmlFor="type">I want to register as...</label>
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
                <div className="divider"></div>
                {/* Show the signup form based on select value */}
                {type === "user" && <UserSignupForm />}
                {type === "restaurant" && <RestSignupForm />}
            </div>
            <div className="login"></div>
        </div>
    );
};
