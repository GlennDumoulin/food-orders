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
    const { updateSizeName, deleteSize, getPricesBySizeId, deletePrice } =
        useFirestore();

    const [sizeName, setSizeName] = useState(size.name);
    const [editSizeError, setEditSizeError] = useState("");
    const [deleteSizeError, setDeleteSizeError] = useState("");

    /**
     * Handle opening a popup & disable scrolling
     * @param {String} action
     */
    const handleOpenPopup = (action) => {
        const popup = document.getElementById(`${action}-size-${size.id}`);
        popup.classList.remove("hidden");

        const body = document.body;
        body.style.overflowX = "hidden";
        body.style.overflowY = "hidden";
    };

    /**
     * Handle submitting update/delete of a size to Firestore
     * @param {Event} ev
     * @param {String} action
     * @returns null|error
     */
    const handleSubmit = async (ev, action) => {
        ev.preventDefault();

        try {
            if (action === "edit") {
                // Get the formdata
                const editSizeForm = document.getElementById(
                    `edit-size-form-${size.id}`
                );
                const formData = new FormData(editSizeForm);
                const name = formData.get("name");

                // Update name of the size in Firestore
                await updateSizeName(size.id, name);

                // Close the popup
                const popup = document.getElementById(`edit-size-${size.id}`);
                popup.classList.add("hidden");
            }
            if (action === "delete") {
                // Get all prices for current size
                const prices = await getPricesBySizeId(size.id);

                // Delete all prices for current size
                prices.forEach(async (price) => {
                    // Delete price from Firestore
                    await deletePrice(price.id);
                });

                // Delete the size from Firstore
                await deleteSize(size.id);
            }

            // Enable scrolling
            const body = document.body;
            body.style.overflowX = "hidden";
            body.style.overflowY = "auto";
        } catch (error) {
            if (action === "edit") setEditSizeError(error.message);
            if (action === "delete") setDeleteSizeError(error.message);
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
                                    onClick={() => handleOpenPopup("edit")}
                                    className="edit-size small"
                                >
                                    <Feather.Edit />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleOpenPopup("delete")}
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
                handleSubmit={(ev) => handleSubmit(ev, "edit")}
            >
                <div className="form-item">
                    <label htmlFor="name">Name</label>
                    <input
                        type="text"
                        name="name"
                        required
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
                handleSubmit={(ev) => handleSubmit(ev, "delete")}
            >
                <span className="error">{deleteSizeError}</span>
            </Popup>
        </Fragment>
    );
};

export default SizeListItem;
