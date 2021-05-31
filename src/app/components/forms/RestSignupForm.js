// Imports
import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import * as Feather from "react-feather";

import { Thumbnail } from "../../components/forms";

import * as Routes from "../../routes";
import { useAuth, useFirestore, useStorage } from "../../services";

import "./RestSignupForm.scss";

// Defining variables for file uploads
const FILE_SIZE = 2 * 1024 * 1024;
const SUPPORTED_FORMATS = ["image/jpg", "image/jpeg", "image/png"];

// Defining the validation schemas for the forms
const restSignupValidationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required").label("name"),
    companyNumber: Yup.string()
        .required("Company number is required")
        .matches(
            /^([0-1]{1})([0-9]{3}).([0-9]{3}.([0-9]{3}))$/,
            "Use this format: 0123.321.123"
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
            "fileFormat",
            "Unsupported Format",
            (value) => value && SUPPORTED_FORMATS.includes(value.type)
        )
        .test(
            "fileSize",
            "File too large: max size is 2MB",
            (value) => value && value.size <= FILE_SIZE
        )
        .label("thumbnail"),
});

const RestSignupForm = ({ children }) => {
    // Define variables and states
    const { signup } = useAuth();
    const { addRestaurant } = useFirestore();
    const { uploadImg } = useStorage();

    const [error, setError] = useState("");
    const [pwVisible, setPwVisible] = useState(false);
    const [confPwVisible, setConfPwVisible] = useState(false);

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
            // Registrate the restaurant using Firebase authentication
            await signup(name, email, password);

            // Add logo to Cloud Storage
            const thumbnailUrl = await uploadImg("logos", name, thumbnail);

            // Add restaurant to Firestore
            await addRestaurant(
                name,
                companyNumber,
                email,
                address,
                city,
                postalCode,
                thumbnailUrl
            );

            // Redirect to Orders page
            window.location.assign(Routes.ORDERS);
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
                    setFieldTouched,
                } = formik;
                return (
                    <Form className="register-restaurant">
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
                                type={pwVisible ? "text" : "password"}
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
                            <label htmlFor="postalCode">Postal code</label>
                            <Field
                                type="number"
                                name="postalCode"
                                id="postalCode"
                                className={
                                    errors.postalCode && touched.postalCode
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
                            <label htmlFor="thumbnail">Upload your logo</label>
                            <input
                                type="file"
                                accept="image/*"
                                name="thumbnail"
                                id="thumbnail"
                                className={
                                    errors.thumbnail && touched.thumbnail
                                        ? "input-error"
                                        : "input-success"
                                }
                                onClick={() =>
                                    setFieldTouched("thumbnail", true, true)
                                }
                                onChange={(ev) => {
                                    setFieldValue(
                                        "thumbnail",
                                        ev.currentTarget.files[0]
                                    );
                                }}
                            />
                            {values.thumbnail &&
                                !errors.thumbnail &&
                                touched.thumbnail && (
                                    <Thumbnail thumbnail={values.thumbnail} />
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
                                !(dirty && isValid) ? "disabled-btn" : ""
                            }
                            disabled={!(dirty && isValid)}
                        >
                            Register as restaurant
                        </button>
                    </Form>
                );
            }}
        </Formik>
    );
};

export default RestSignupForm;
