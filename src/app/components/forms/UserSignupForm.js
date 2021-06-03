// Imports
import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import * as Feather from "react-feather";

import * as Routes from "../../routes";
import { useAuth, useFirestore } from "../../services";

import "./UserSignupForm.scss";

// Defining the validation schemas for the forms
const userSignupValidationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required").label("name"),
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

// Show the form for the user signup
const UserSignupForm = ({ children }) => {
    // Define variables and states
    const { signup } = useAuth();
    const { addUser } = useFirestore();

    const [error, setError] = useState("");
    const [pwVisible, setPwVisible] = useState(false);
    const [confPwVisible, setConfPwVisible] = useState(false);

    /**
     * Handle user signup
     * @param {Object} formData
     * @returns redirect|error
     */
    const handleUserSignup = async ({ name, email, password }) => {
        try {
            // Registrate the user using Firebase authentication
            const user = await signup(name, email, password);

            // Add user to Firestore
            await addUser(user.uid, name, email);

            // Redirect to Home page
            window.location.assign(Routes.MY_OVERVIEW);
        } catch (error) {
            setError(error.message);
        }
    };

    // Handle password visibility functions
    const handlePwVisibility = () => {
        setPwVisible(!pwVisible);
    };

    const handleConfPwVisibility = () => {
        setConfPwVisible(!confPwVisible);
    };

    return (
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
                    <Form className="register-form--user">
                        <span className="error">{error}</span>
                        <div className="form-item">
                            <label htmlFor="name">Name</label>
                            <Field
                                type="text"
                                name="name"
                                id="register-name"
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
                                id="register-email"
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
                                type={pwVisible ? "text" : "password"}
                                name="password"
                                id="register-password"
                                className={
                                    errors.password && touched.password
                                        ? "input-error"
                                        : "input-success"
                                }
                            />
                            <i
                                className="password-visibility"
                                onClick={handlePwVisibility}
                            >
                                {pwVisible ? (
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
                                type={confPwVisible ? "text" : "password"}
                                name="confirmPassword"
                                id="register-confirmPassword"
                                className={
                                    errors.confirmPassword &&
                                    touched.confirmPassword
                                        ? "input-error"
                                        : "input-success"
                                }
                            />
                            <i
                                className="password-visibility"
                                onClick={handleConfPwVisibility}
                            >
                                {confPwVisible ? (
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
                            className={!(dirty && isValid) ? "disabled" : ""}
                            disabled={!(dirty && isValid)}
                        >
                            Register as user
                        </button>
                    </Form>
                );
            }}
        </Formik>
    );
};

export default UserSignupForm;
