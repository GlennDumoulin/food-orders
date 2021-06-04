// Imports
import React, { useState, Fragment } from "react";
import * as Feather from "react-feather";
import { Draggable } from "react-beautiful-dnd";

import { Popup } from "../popup";
import { useFirestore } from "../../services";

import "./SizeListItem.scss";

// Size list item content
const SizeListItem = ({ size, index }) => {
    // Define variables and states
    const { updateSizeName, deleteSize } = useFirestore();

    const [sizeName, setSizeName] = useState(size.name);
    const [editSizeError, setEditSizeError] = useState("");
    const [deleteSizeError, setDeleteSizeError] = useState("");

    // Handle opening the edit size popup & disable scrolling
    const handleEditSizePopup = () => {
        const editSizePopup = document.getElementById(`edit-size-${size.id}`);
        editSizePopup.classList.remove("hidden");

        const body = document.body;
        body.style.overflowX = "hidden";
        body.style.overflowY = "hidden";
    };

    // Handle adding a size to Firestore
    const handleEditSize = async (ev) => {
        ev.preventDefault();

        try {
            // Get the formdata
            const editSizeForm = document.getElementById(
                `edit-size-form-${size.id}`
            );
            const formData = new FormData(editSizeForm);
            const name = formData.get("name");

            // Update name of the size in Firestore
            await updateSizeName(size.id, name);

            // Close the popup & enable scrolling
            const popup = document.getElementById(`edit-size-${size.id}`);
            popup.classList.add("hidden");

            const body = document.body;
            body.style.overflowX = "hidden";
            body.style.overflowY = "auto";
        } catch (error) {
            setEditSizeError(error.message);
        }
    };

    // Handle opening the delete size popup & disable scrolling
    const handleDeleteSizePopup = () => {
        const deleteSizePopup = document.getElementById(
            `delete-size-${size.id}`
        );
        deleteSizePopup.classList.remove("hidden");

        const body = document.body;
        body.style.overflowX = "hidden";
        body.style.overflowY = "hidden";
    };

    const handleDeleteSize = async (ev) => {
        ev.preventDefault();

        try {
            // Delete the size from Firstore
            await deleteSize(size.id);

            // Enable scrolling
            const body = document.body;
            body.style.overflowX = "hidden";
            body.style.overflowY = "auto";
        } catch (error) {
            setDeleteSizeError(error.message);
        }
    };

    return (
        <Fragment>
            <Draggable key={size.id} draggableId={size.id} index={index}>
                {(provided) => (
                    <li
                        className="sizes-list--item"
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        ref={provided.innerRef}
                    >
                        <div className="d-flex justify-content-between align-items-center">
                            <h3>{size.name}</h3>
                            <div className="manage-size-container">
                                <button
                                    type="button"
                                    onClick={handleEditSizePopup}
                                    className="edit-size small"
                                >
                                    <Feather.Edit />
                                </button>
                                <button
                                    type="button"
                                    onClick={handleDeleteSizePopup}
                                    className="delete-size danger small"
                                >
                                    <Feather.Trash2 />
                                </button>
                            </div>
                        </div>
                    </li>
                )}
            </Draggable>
            <Popup
                popupId={`edit-size-${size.id}`}
                title="Edit size"
                formId={`edit-size-form-${size.id}`}
                handleSubmit={handleEditSize}
            >
                <div className="form-item">
                    <label htmlFor="name">Name</label>
                    <input
                        type="text"
                        name="name"
                        value={sizeName}
                        onChange={(ev) => setSizeName(ev.target.value)}
                    />
                </div>
                <span className="error">{editSizeError}</span>
            </Popup>
            <Popup
                popupId={`delete-size-${size.id}`}
                title="Are you sure you want to delete this size?"
                description={size.name}
                formId={`edit-size-form-${size.id}`}
                handleSubmit={handleDeleteSize}
            >
                <span className="error">{deleteSizeError}</span>
            </Popup>
        </Fragment>
    );
};

export default SizeListItem;
