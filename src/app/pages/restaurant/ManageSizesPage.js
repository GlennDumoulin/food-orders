// Imports
import React, { useState, useEffect } from "react";
import * as Feather from "react-feather";
import { DragDropContext, Droppable } from "react-beautiful-dnd";

import { Popup } from "../../components/popup";
import { SizeListItem } from "../../components/sizes";
import * as Routes from "../../routes";
import { useFirebase, useFirestore } from "../../services";

import "./ManageSizesPage.scss";

// Page content
export const ManageSizesPage = ({ children }) => {
    // Define variables and states
    const { app } = useFirebase();
    const db = app.firestore();
    const { addSize, updateSizeOrder, user } = useFirestore();

    const [sizes, setSizes] = useState([]);
    const [msg, setMsg] = useState("");
    const [addSizeError, setAddSizeError] = useState("");
    const [saveChangesError, setSaveChangesError] = useState("");

    // Handle opening the add size popup & disable scrolling
    const handleAddSizePopup = async () => {
        const addSizePopup = document.getElementById("add-size");
        addSizePopup.classList.remove("hidden");

        const body = document.body;
        body.style.overflowX = "hidden";
        body.style.overflowY = "hidden";
    };

    // Handle adding a size to Firestore
    const handleAddSize = async (ev) => {
        ev.preventDefault();

        try {
            // Get the formdata
            const addSizeForm = document.getElementById("add-size-form");
            const formData = new FormData(addSizeForm);
            const name = formData.get("name");

            // Add size to Firestore
            const restaurantId = user ? user.uid : "";
            await addSize(name, restaurantId);

            // Close the popup & enable scrolling
            const popup = document.getElementById("add-size");
            popup.classList.add("hidden");

            const body = document.body;
            body.style.overflowX = "hidden";
            body.style.overflowY = "auto";
        } catch (error) {
            setAddSizeError(error.message);
        }
    };

    // Handle saving changes
    const handleSaveChanges = async () => {
        try {
            // Update order of the sizes in Firestore
            sizes.map(async (size, index) => {
                await updateSizeOrder(size, index);
            });

            // Set success message
            setSaveChangesError("");
            setMsg("Changes have been saved");
        } catch (error) {
            setMsg("");
            setSaveChangesError(error.message);
        }
    };

    // Handle reordering the sizes after drag
    const handleOnDragEnd = (result) => {
        if (!result.destination) return;

        const items = Array.from(sizes);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        setSizes(items);
    };

    // Set sizes by restaurant on page load and update on change
    useEffect(() => {
        const restaurantId = user ? user.uid : "";

        const unsubscribe = () => {
            db.collection("sizes")
                .where("restaurantId", "==", restaurantId)
                .orderBy("order")
                .onSnapshot((querySnapshot) => {
                    const sizes = querySnapshot.docs.map((doc) => {
                        return {
                            id: doc.id,
                            ...doc.data(),
                        };
                    });
                    setSizes(sizes);
                });
        };

        // Stop listening to changes
        unsubscribe();
    }, [user, db]);

    return (
        <div className="page page--manage-sizes">
            <div className="back-btn">
                <Feather.ArrowLeftCircle
                    onClick={() => window.location.assign(Routes.OUR_MENU)}
                    className="btn-icon"
                />
            </div>
            <h1>Manage Sizes</h1>
            <p>
                By using a simple drag and drop you can order your sizes the way
                you want your customers to see them.
            </p>
            <DragDropContext onDragEnd={handleOnDragEnd}>
                <Droppable droppableId="sizes-list">
                    {(provided) => (
                        <ul
                            className="sizes-list"
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                        >
                            {!!sizes ? (
                                sizes.map((size, index) => {
                                    return (
                                        <SizeListItem
                                            key={size.id}
                                            size={size}
                                            index={index}
                                        />
                                    );
                                })
                            ) : (
                                <h3>No sizes found</h3>
                            )}
                            {provided.placeholder}
                        </ul>
                    )}
                </Droppable>
            </DragDropContext>
            <button type="button" onClick={handleAddSizePopup} className="fill">
                <Feather.Plus /> Add size
            </button>
            <button
                type="button"
                onClick={handleSaveChanges}
                className="save-btn fill"
            >
                Save order changes
            </button>
            <span className="success">{msg}</span>
            <span className="error">{saveChangesError}</span>
            <Popup
                popupId="add-size"
                title="Add size"
                formId="add-size-form"
                handleSubmit={handleAddSize}
            >
                <div className="form-item">
                    <label htmlFor="name">Name</label>
                    <input type="text" name="name" required />
                </div>
                <span className="error">{addSizeError}</span>
            </Popup>
        </div>
    );
};
