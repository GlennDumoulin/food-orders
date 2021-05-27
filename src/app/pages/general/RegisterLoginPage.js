// Imports
import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import * as Feather from "react-feather";

import * as Routes from "../../routes";
import { useAuth, useFirestore } from "../../services";

import "./RegisterLoginPage.scss";

// Defining variables for file uploads
const FILE_SIZE = 160 * 1024;
const SUPPORTED_FORMATS = ["image/jpg", "image/jpeg", "image/png"];

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

const restSignupValidationSchema = Yup.object().shape({
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
    address: Yup.string()
        .required("Address is required")
        .matches(
            /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d ]{1,}$/,
            "Address must contain the number"
        )
        .label("address"),
    city: Yup.string().required("City is required").label("city"),
    postalCode: Yup.number()
        .required("Postal code is required")
        .min(1000, "Enter a valid postal code")
        .max(9999, "Enter a valid postal code")
        .label("postalCode"),
    thumbnail: Yup.mixed()
        .required("Logo is required")
        .test(
            "fileSize",
            "File too large",
            (value) => value && value.size <= FILE_SIZE
        )
        .test(
            "fileFormat",
            "Unsupported Format",
            (value) => value && SUPPORTED_FORMATS.includes(value.type)
        )
        .label("thumbnail"),
});

// Page content
export const RegisterLoginPage = ({ children }) => {
    // Define variables and states
    const { signup } = useAuth();
    const { addUser } = useFirestore();

    const [type, setType] = useState("user");
    const [error, setError] = useState("");
    const [userSignupPwVisible, setUserSignupPwVisible] = useState(false);
    const [userSignupConfPwVisible, setUserSignupConfPwVisible] =
        useState(false);
    const [restSignupPwVisible, setRestSignupPwVisible] = useState(false);
    const [restSignupConfPwVisible, setRestSignupConfPwVisible] =
        useState(false);

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
    const handleRestaurantSignup = async ({
        name,
        companyNumber,
        email,
        password,
        address,
        city,
        postalCode,
        thumbnail,
    }) => {
        try {
            console.log(
                `${name} | ${companyNumber} | ${email} | ${password} | ${address} | ${city} | ${postalCode} | ${thumbnail}`
            );
            // Registrate the restaurant using Firebase authentication
            // await signup(name, email, password);

            // Add restaurant to Firestore
            // await addRestaurant(name, companyNumber, email, address, city, postalCode, thumbnail);

            // Redirect to Home page
            // window.location.assign(Routes.ORDERS);
        } catch (error) {
            setError(error.message);
        }
    };

    // Handle password Visible functions
    const handleUserSignupPwVisibility = () => {
        setUserSignupPwVisible(!userSignupPwVisible);
    };

    const handleUserSignupConfPwVisibility = () => {
        setUserSignupConfPwVisible(!userSignupConfPwVisible);
    };

    const handleRestSignupPwVisibility = () => {
        setRestSignupPwVisible(!restSignupPwVisible);
    };

    const handleRestSignupConfPwVisibility = () => {
        setRestSignupConfPwVisible(!restSignupConfPwVisible);
    };

    return (
        <div className="page page--register-login">
            <h1>Register/Login</h1>
            <label htmlFor="type">I want to register as...</label>
            <select
                name="type"
                onChange={(ev) => {
                    setType(ev.target.value);
                    setUserSignupPwVisible(false);
                    setUserSignupConfPwVisible(false);
                    setRestSignupPwVisible(false);
                    setRestSignupConfPwVisible(false);
                }}
                value={type}
            >
                <option value="user">User</option>
                <option value="restaurant">Restaurant</option>
            </select>
            <div className="divider"></div>
            {/* Show the signup form based on select value */}
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
                                            userSignupPwVisible
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
                                        onClick={handleUserSignupPwVisibility}
                                    >
                                        {userSignupPwVisible ? (
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
                                            userSignupConfPwVisible
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
                                            handleUserSignupConfPwVisibility
                                        }
                                    >
                                        {userSignupConfPwVisible ? (
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
                        address: "",
                        city: "",
                        postalCode: 0,
                        thumbnail: "",
                    }}
                    onSubmit={handleRestaurantSignup}
                    validationSchema={restSignupValidationSchema}
                >
                    {(formik) => {
                        const {
                            values,
                            errors,
                            touched,
                            isValid,
                            dirty,
                            setFieldValue,
                        } = formik;
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
                                            restSignupPwVisible
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
                                        onClick={handleRestSignupPwVisibility}
                                    >
                                        {restSignupPwVisible ? (
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
                                            restSignupConfPwVisible
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
                                            handleRestSignupConfPwVisibility
                                        }
                                    >
                                        {restSignupConfPwVisible ? (
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
                                <div className="form-item">
                                    <label htmlFor="address">Address</label>
                                    <Field
                                        type="text"
                                        name="address"
                                        id="address"
                                        className={
                                            errors.address && touched.address
                                                ? "input-error"
                                                : "input-success"
                                        }
                                    />
                                    <ErrorMessage
                                        name="address"
                                        component="span"
                                        className="error"
                                    />
                                </div>
                                <div className="form-item">
                                    <label htmlFor="city">City</label>
                                    <Field
                                        type="text"
                                        name="city"
                                        id="city"
                                        className={
                                            errors.city && touched.city
                                                ? "input-error"
                                                : "input-success"
                                        }
                                    />
                                    <ErrorMessage
                                        name="city"
                                        component="span"
                                        className="error"
                                    />
                                </div>
                                <div className="form-item">
                                    <label htmlFor="postalCode">
                                        Postal code
                                    </label>
                                    <Field
                                        type="number"
                                        name="postalCode"
                                        id="postalCode"
                                        className={
                                            errors.postalCode &&
                                            touched.postalCode
                                                ? "input-error"
                                                : "input-success"
                                        }
                                    />
                                    <ErrorMessage
                                        name="postalCode"
                                        component="span"
                                        className="error"
                                    />
                                </div>
                                <div className="form-item">
                                    <label htmlFor="thumbnail">
                                        Upload your logo
                                    </label>
                                    <Field
                                        type="file"
                                        accept="image/*"
                                        name="thumbnail"
                                        id="thumbnail"
                                        className={
                                            errors.thumbnail &&
                                            touched.thumbnail
                                                ? "input-error"
                                                : "input-success"
                                        }
                                        onChange={(ev) => {
                                            console.log(ev.target.files[0]);
                                            setFieldValue(
                                                "thumbnail",
                                                ev.target.files[0]
                                            );
                                        }}
                                    />
                                    {values.thumbnail &&
                                        !errors.thumbnail &&
                                        touched.thumbnail && (
                                            <img
                                                src={values.file}
                                                alt={values.file.name}
                                            />
                                        )}
                                    <ErrorMessage
                                        name="thumbnail"
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
