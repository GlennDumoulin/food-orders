// Imports
import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

import { Thumbnail } from "../../components/forms";

// Defining variables for file upload
const FILE_SIZE = 2 * 1024 * 1024;
const SUPPORTED_FORMATS = ["image/jpg", "image/jpeg", "image/png"];

// Defining the validation schema
const dishInfoValidationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required").label("name"),
    description: Yup.string().optional().label("email"),
    thumbnail: Yup.mixed()
        .required("Image is required")
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

const DishInfoForm = ({
    initialValues = { name: "", description: "", thumbnail: "" },
    handleSubmit,
}) => {
    return (
        <Formik
            initialValues={initialValues}
            onSubmit={handleSubmit}
            validationSchema={dishInfoValidationSchema}
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
                    <Form className="dish-ifo">
                        <div className="form-item">
                            <label htmlFor="name">Name</label>
                            <Field
                                type="text"
                                name="name"
                                id="name"
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
                            <label htmlFor="description">
                                Description{" "}
                                <span className="small">(optional)</span>
                            </label>
                            <Field
                                as="textarea"
                                type="text"
                                name="description"
                                id="description"
                                className={
                                    touched.description ? "input-success" : ""
                                }
                            />
                        </div>
                        <div className="form-item d-flex justify-content-between">
                            <div className="d-flex flex-column justify-content-between">
                                <label htmlFor="thumbnail">
                                    Select an image
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    name="thumbnail"
                                    id="thumbnail"
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
                                            .getElementById("thumbnail")
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
                            Save info changes
                        </button>
                    </Form>
                );
            }}
        </Formik>
    );
};

export default DishInfoForm;
