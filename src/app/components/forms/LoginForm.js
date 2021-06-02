// Imports
import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import * as Feather from "react-feather";

import * as Routes from "../../routes";
import { useAuth, useFirestore } from "../../services";

import "./LoginForm.scss";

// Defining the validation schemas for the forms
const loginValidationSchema = Yup.object().shape({
    email: Yup.string()
        .required("Email is required")
        .email("Enter a valid email")
        .label("email"),
    password: Yup.string()
        .required("Password is required")
        .min(8)
        .label("password"),
});

// Show the form for the user signup
const LoginForm = ({ children }) => {
    // Define variables and states
    const { login } = useAuth();
    const { getTypeByEmail } = useFirestore();

    const [error, setError] = useState("");
    const [pwVisible, setPwVisible] = useState(false);

    /**
     * Handle user signup
     * @param {Object} formData
     * @returns redirect|error
     */
    const handleLogin = async ({ email, password }) => {
        try {
            // Log person in using Firebase authentication
            await login(email, password);

            // Get the type of person logging in
            const type = await getTypeByEmail(email);

            // Redirect depending on type
            if (type && type === "user")
                window.location.assign(Routes.MY_OVERVIEW);
            if (type && type === "admin")
                window.location.assign(Routes.MANAGE_RESTAURANTS);
            if (type && type === "restaurant")
                window.location.assign(Routes.ORDERS);
        } catch (error) {
            setError(error.message);
        }
    };

    // Handle password visibility function
    const handlePwVisibility = () => {
        setPwVisible(!pwVisible);
    };

    return (
        <Formik
            initialValues={{
                email: "",
                password: "",
            }}
            onSubmit={handleLogin}
            validationSchema={loginValidationSchema}
        >
            {(formik) => {
                const { errors, touched, isValid, dirty } = formik;
                return (
                    <Form className="login-form">
                        <span className="error">{error}</span>
                        <div className="form-item">
                            <label htmlFor="email">Email</label>
                            <Field
                                type="email"
                                name="email"
                                id="login-email"
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
                                id="login-password"
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
                        <button
                            type="submit"
                            className={!(dirty && isValid) ? "disabled" : ""}
                            disabled={!(dirty && isValid)}
                        >
                            Login
                        </button>
                    </Form>
                );
            }}
        </Formik>
    );
};

export default LoginForm;
