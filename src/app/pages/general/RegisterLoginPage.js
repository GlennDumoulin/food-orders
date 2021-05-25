// Imports
import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import * as Feather from "react-feather";

import { useAuth } from "../../services";

import "./RegisterLoginPage.scss";

// Defining the validation schemas
const userSignupValidationSchema = Yup.object().shape({
    name: Yup.string()
        .required("Name is required")
        .min(1, "Name is too short")
        .label("name"),
    email: Yup.string()
        .required("Email is required")
        .email("Enter a valid email")
        .label("email"),
    password: Yup.string()
        .required("Password is required")
        .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
            "Password requirements: minimum 8 characters, at least one uppercase letter, one lowercase letter, one number and one special character"
        )
        .label("password"),
    confirmPassword: Yup.string()
        .required("Confirm password is required")
        .oneOf([Yup.ref("password"), null], "Passwords must match")
        .label("confirmPassword"),
});

// Page content
export const RegisterLoginPage = ({ children }) => {
    const { signup } = useAuth();
    const [error, setError] = useState("");
    const [userSignupPasswordVisibility, setUserSignupPasswordVisibility] =
        useState(false);
    const [
        userSignupConfirmPasswordVisibility,
        setUserSignupConfirmPasswordVisibility,
    ] = useState(false);

    // Handle user signup
    const handleUserSignup = async ({ name, email, password }) => {
        try {
            await signup(name, email, password);
        } catch (error) {
            setError(error.message);
        }
    };

    // Handle password visibility functions
    const handleUserSignupPasswordVisibility = () => {
        setUserSignupPasswordVisibility(!userSignupPasswordVisibility);
    };

    const handleUserSignupConfirmPasswordVisibility = () => {
        setUserSignupConfirmPasswordVisibility(
            !userSignupConfirmPasswordVisibility
        );
    };

    return (
        <div className="page page--register-login">
            <h1>Register/Login</h1>
            <Formik
                initialValues={{
                    name: "",
                    email: "",
                    password: "",
                    confirmPassword: "",
                }}
                onSubmit={handleUserSignup}
                validationSchema={userSignupValidationSchema}
            >
                {(formik) => {
                    const { errors, touched, isValid, dirty } = formik;
                    return (
                        <Form>
                            <span className="error">{error}</span>
                            <div className="form-item">
                                <label htmlFor="name">Name</label>
                                <Field
                                    type="text"
                                    name="name"
                                    id="name"
                                    className={
                                        errors.name && touched.name
                                            ? "input-error"
                                            : "input-success"
                                    }
                                />
                                <ErrorMessage
                                    name="name"
                                    component="span"
                                    className="error"
                                />
                            </div>
                            <div className="form-item">
                                <label htmlFor="email">Email</label>
                                <Field
                                    type="email"
                                    name="email"
                                    id="email"
                                    className={
                                        errors.email && touched.email
                                            ? "input-error"
                                            : "input-success"
                                    }
                                />
                                <ErrorMessage
                                    name="email"
                                    component="span"
                                    className="error"
                                />
                            </div>
                            <div className="form-item">
                                <label htmlFor="password">Password</label>
                                <Field
                                    type={
                                        userSignupPasswordVisibility
                                            ? "text"
                                            : "password"
                                    }
                                    name="password"
                                    id="password"
                                    className={
                                        errors.password && touched.password
                                            ? "input-error"
                                            : "input-success"
                                    }
                                />
                                <i
                                    className="password-visibility"
                                    onClick={handleUserSignupPasswordVisibility}
                                >
                                    {userSignupPasswordVisibility ? (
                                        <Feather.EyeOff />
                                    ) : (
                                        <Feather.Eye />
                                    )}
                                </i>
                                <ErrorMessage
                                    name="password"
                                    component="span"
                                    className="error"
                                />
                            </div>
                            <div className="form-item">
                                <label htmlFor="confirmPassword">
                                    Confirm password
                                </label>
                                <Field
                                    type={
                                        userSignupConfirmPasswordVisibility
                                            ? "text"
                                            : "password"
                                    }
                                    name="confirmPassword"
                                    id="confirmPassword"
                                    className={
                                        errors.confirmPassword &&
                                        touched.confirmPassword
                                            ? "input-error"
                                            : "input-success"
                                    }
                                />
                                <i
                                    className="password-visibility"
                                    onClick={
                                        handleUserSignupConfirmPasswordVisibility
                                    }
                                >
                                    {userSignupConfirmPasswordVisibility ? (
                                        <Feather.EyeOff />
                                    ) : (
                                        <Feather.Eye />
                                    )}
                                </i>
                                <ErrorMessage
                                    name="confirmPassword"
                                    component="span"
                                    className="error"
                                />
                            </div>
                            <button
                                type="submit"
                                className={
                                    !(dirty && isValid) ? "disabled-btn" : ""
                                }
                                disabled={!(dirty && isValid)}
                            >
                                Register as user
                            </button>
                        </Form>
                    );
                }}
            </Formik>
        </div>
    );
};
