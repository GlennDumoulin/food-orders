// Imports
import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import * as Feather from "react-feather";

import * as Routes from "../../routes";
import { useAuth, useFirestore } from "../../services";

import "./RegisterLoginPage.scss";

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

const restaurantSignupValidationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required").label("name"),
    companyNumber: Yup.string()
        .required("Company number is required")
        .matches(
            /^([0-1]{1})([0-9]{3}).([0-9]{3}.([0-9]{3}))$/,
            "Enter a valid company number"
        )
        .label("companyNumber"),
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
    address: Yup.string().required("Address is required").label("address"),
    city: Yup.string().required("City is required").label("city"),
    postalCode: Yup.number()
        .required("Postal code is required")
        .min(1000, "Enter a valid postal code")
        .max(9999, "Enter a valid postal code")
        .label("postalCode"),
    thumbnail: Yup.string()
        .required("Uploading your logo is required")
        .label("thumbnail"),
});

// Page content
export const RegisterLoginPage = ({ children }) => {
    // Define variables and states
    const { signup } = useAuth();
    const { addUser } = useFirestore();

    const [type, setType] = useState("user");
    const [error, setError] = useState("");
    const [userSignupPasswordVisibility, setUserSignupPasswordVisibility] =
        useState(false);
    const [
        userSignupConfirmPasswordVisibility,
        setUserSignupConfirmPasswordVisibility,
    ] = useState(false);
    const [
        restaurantSignupPasswordVisibility,
        setRestaurantSignupPasswordVisibility,
    ] = useState(false);
    const [
        restaurantSignupConfirmPasswordVisibility,
        setRestaurantSignupConfirmPasswordVisibility,
    ] = useState(false);

    /**
     * Handle user signup
     * @param {Object} formData
     * @returns redirect|error
     */
    const handleUserSignup = async ({ name, email, password }) => {
        try {
            // Registrate the user using Firebase authentication
            await signup(name, email, password);

            // Add user to Firestore
            await addUser(name, email);

            // Redirect to Home page
            window.location.assign(Routes.HOME);
        } catch (error) {
            setError(error.message);
        }
    };

    /**
     * Handle restaurant signup
     * @param {Object} formData
     * @returns redirect|error
     */
    const handleRestaurantSignup = async ({ name, email, password }) => {
        try {
            // Registrate the restaurant using Firebase authentication
            // await signup(name, email, password);

            // Add restaurant to Firestore
            // await addRestaurant(name, email);

            // Redirect to Home page
            window.location.assign(Routes.ORDERS);
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
    const handleRestaurantSignupPasswordVisibility = () => {
        setRestaurantSignupPasswordVisibility(
            !restaurantSignupPasswordVisibility
        );
    };

    const handleRestaurantSignupConfirmPasswordVisibility = () => {
        setRestaurantSignupConfirmPasswordVisibility(
            !restaurantSignupConfirmPasswordVisibility
        );
    };

    return (
        <div className="page page--register-login">
            <h1>Register/Login</h1>
            <select
                name="type"
                onChange={(ev) => {
                    setType(ev.target.value);
                    setUserSignupPasswordVisibility(false);
                    setUserSignupConfirmPasswordVisibility(false);
                    setRestaurantSignupPasswordVisibility(false);
                    setRestaurantSignupConfirmPasswordVisibility(false);
                }}
                value={type}
            >
                <option value="user">User</option>
                <option value="restaurant">Restaurant</option>
            </select>
            {type === "user" && (
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
                                        onClick={
                                            handleUserSignupPasswordVisibility
                                        }
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
                                        !(dirty && isValid)
                                            ? "disabled-btn"
                                            : ""
                                    }
                                    disabled={!(dirty && isValid)}
                                >
                                    Register as user
                                </button>
                            </Form>
                        );
                    }}
                </Formik>
            )}
            {type === "restaurant" && (
                <Formik
                    initialValues={{
                        name: "",
                        companyNumber: "",
                        email: "",
                        password: "",
                        confirmPassword: "",
                    }}
                    onSubmit={handleRestaurantSignup}
                    validationSchema={restaurantSignupValidationSchema}
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
                                    <label htmlFor="companyNumber">
                                        Company number
                                    </label>
                                    <Field
                                        type="text"
                                        name="companyNumber"
                                        id="companyNumber"
                                        className={
                                            errors.companyNumber &&
                                            touched.companyNumber
                                                ? "input-error"
                                                : "input-success"
                                        }
                                    />
                                    <ErrorMessage
                                        name="companyNumber"
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
                                            restaurantSignupPasswordVisibility
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
                                        onClick={
                                            handleRestaurantSignupPasswordVisibility
                                        }
                                    >
                                        {restaurantSignupPasswordVisibility ? (
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
                                            restaurantSignupConfirmPasswordVisibility
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
                                            handleRestaurantSignupConfirmPasswordVisibility
                                        }
                                    >
                                        {restaurantSignupConfirmPasswordVisibility ? (
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
                                        !(dirty && isValid)
                                            ? "disabled-btn"
                                            : ""
                                    }
                                    disabled={!(dirty && isValid)}
                                >
                                    Register as restaurant
                                </button>
                            </Form>
                        );
                    }}
                </Formik>
            )}
        </div>
    );
};
