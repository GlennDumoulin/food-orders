// Imports
import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import * as Feather from "react-feather";

import * as Routes from "../../routes";
import { useAuth } from "../../services";

// Defining the validation schema
const loginValidationSchema = Yup.object().shape({
    email: Yup.string()
        .required("Email is required")
        .email("Enter a valid email")
        .label("email"),
    password: Yup.string()
        .required("Password is required")
        .min(8, "Password must be at least 8 characters")
        .label("password"),
});

// Show the form for the user signup
const LoginForm = ({ children }) => {
    // Define variables and states
    const { login } = useAuth();

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
                                    touched.email
                                        ? errors.email
                                            ? "input-error"
                                            : "input-success"
                                        : ""
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
                                    touched.password
                                        ? errors.password
                                            ? "input-error"
                                            : "input-success"
                                        : ""
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
                            <a href={Routes.FORGOT_PASSWORD}>
                                Forgot password?
                            </a>
                        </div>
                        <button
                            type="submit"
                            className={
                                !(dirty && isValid) ? "fill disabled" : "fill"
                            }
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
