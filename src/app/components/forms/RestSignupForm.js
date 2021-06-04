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
    postalCode: Yup.number()
        .required("Postal code is required")
        .min(1000, "Enter a valid postal code")
        .max(9999, "Enter a valid postal code")
        .label("postalCode"),
    city: Yup.string().required("City is required").label("city"),
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
        postalCode,
        city,
        thumbnail,
    }) => {
        try {
            // Registrate the restaurant using Firebase authentication
            const user = await signup(name, email, password);

            // Add logo to Cloud Storage
            const thumbnailUrl = await uploadImg("logos", name, thumbnail);

            // Add restaurant to Firestore
            await addRestaurant(
                user.uid,
                name,
                companyNumber,
                email,
                address,
                postalCode,
                city,
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
                postalCode: 0,
                city: "",
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
                    <Form className="register-form--restaurant">
                        <span className="error">{error}</span>
                        <div className="form-item">
                            <label htmlFor="name">Name</label>
                            <Field
                                type="text"
                                name="name"
                                id="register-name"
                                className={
                                    touched.name
                                        ? errors.name
                                            ? "input-error"
                                            : "input-success"
                                        : ""
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
                                id="register-companyNumber"
                                className={
                                    touched.companyNumber
                                        ? errors.companyNumber
                                            ? "input-error"
                                            : "input-success"
                                        : ""
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
                                id="register-email"
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
                                id="register-password"
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
                                    touched.confirmPassword
                                        ? errors.confirmPassword
                                            ? "input-error"
                                            : "input-success"
                                        : ""
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
                                id="register-address"
                                className={
                                    touched.address
                                        ? errors.address
                                            ? "input-error"
                                            : "input-success"
                                        : ""
                                }
                            />
                            <ErrorMessage
                                name="address"
                                component="span"
                                className="error"
                            />
                        </div>
                        <div className="form-group row">
                            <div className="form-item col-12 col-md-5">
                                <label htmlFor="postalCode">Postal code</label>
                                <Field
                                    type="number"
                                    name="postalCode"
                                    id="register-postalCode"
                                    className={
                                        touched.postalCode
                                            ? errors.postalCode
                                                ? "input-error"
                                                : "input-success"
                                            : ""
                                    }
                                />
                                <ErrorMessage
                                    name="postalCode"
                                    component="span"
                                    className="error"
                                />
                            </div>
                            <div className="form-item col-12 col-md-7">
                                <label htmlFor="city">City</label>
                                <Field
                                    type="text"
                                    name="city"
                                    id="register-city"
                                    className={
                                        touched.city
                                            ? errors.city
                                                ? "input-error"
                                                : "input-success"
                                            : ""
                                    }
                                />
                                <ErrorMessage
                                    name="city"
                                    component="span"
                                    className="error"
                                />
                            </div>
                        </div>
                        <div className="form-item d-flex justify-content-between">
                            <div className="d-flex flex-column justify-content-between">
                                <label htmlFor="thumbnail">
                                    Upload your logo
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    name="thumbnail"
                                    id="register-thumbnail"
                                    className="hidden"
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
                                <button
                                    type="button"
                                    className="d-block"
                                    onClick={() => {
                                        document
                                            .getElementById(
                                                "register-thumbnail"
                                            )
                                            .click();
                                    }}
                                >
                                    Browse files
                                </button>
                            </div>
                            <div className="d-flex flex-column align-items-end">
                                <div
                                    className={
                                        touched.thumbnail
                                            ? errors.thumbnail
                                                ? "thumbnail-preview error"
                                                : "thumbnail-preview success"
                                            : "thumbnail-preview"
                                    }
                                >
                                    {values.thumbnail &&
                                        !errors.thumbnail &&
                                        touched.thumbnail && (
                                            <Thumbnail
                                                thumbnail={values.thumbnail}
                                            />
                                        )}
                                </div>
                                <ErrorMessage
                                    name="thumbnail"
                                    component="span"
                                    className="error"
                                />
                            </div>
                        </div>
                        <button
                            type="submit"
                            className={
                                !(dirty && isValid) ? "fill disabled" : "fill"
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
