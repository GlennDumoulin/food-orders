// Imports
import React, { useState, useEffect, Fragment } from "react";
import { useParams } from "react-router-dom";
import * as Feather from "react-feather";

import { Popup } from "../../components/popup";
import { useFirestore } from "../../services";

import "./OrderItemCard.scss";

// Order item card content
const OrderItemCard = ({ item, status }) => {
    // Defining variables and states
    const { id } = useParams();
    const {
        getPriceById,
        getDishById,
        getSizeById,
        deleteOrderContent,
        addOrderContent,
    } = useFirestore();

    const [price, setPrice] = useState();
    const [dish, setDish] = useState();
    const [size, setSize] = useState();
    const [amount, setAmount] = useState();
    const [loading, setLoading] = useState(true);
    const [editItemError, setEditItemError] = useState("");
    const [deleteItemError, setDeleteItemError] = useState("");

    /**
     * Handle opening a popup & disable scrolling
     * @param {String} action
     */
    const handleOpenPopup = (action) => {
        // Reset amount the current amount
        if (action === "edit") {
            setAmount(item.amount);
        }

        const popup = document.getElementById(`${action}-item-${item.priceId}`);
        popup.classList.remove("hidden");

        const body = document.body;
        body.style.overflowX = "hidden";
        body.style.overflowY = "hidden";
    };

    /**
     * Handle submitting update/delete of a item to Firestore
     * @param {Event} ev
     * @param {String} action
     * @returns null|error
     */
    const handleSubmit = async (ev, action) => {
        ev.preventDefault();

        try {
            if (action === "edit") {
                // Get the formdata
                const editItemForm = document.getElementById(
                    `edit-item-form-${item.priceId}`
                );
                const formData = new FormData(editItemForm);
                const amount = formData.get("amount");

                // Delete previous item from order from Firestore
                await deleteOrderContent(id, item);

                // Set updated item
                const updatedItem = {
                    priceId: item.priceId,
                    amount: parseInt(amount),
                };

                // Add item to order in Firestore
                await addOrderContent(id, updatedItem);

                // Close the popup
                const popup = document.getElementById(
                    `edit-item-${item.priceId}`
                );
                popup.classList.add("hidden");
            }
            if (action === "delete") {
                // Delete the size from Firstore
                await deleteOrderContent(id, item);
            }

            // Enable scrolling
            const body = document.body;
            body.style.overflowX = "hidden";
            body.style.overflowY = "auto";
        } catch (error) {
            if (action === "edit") setEditItemError(error.message);
            if (action === "delete") setDeleteItemError(error.message);
        }
    };

    // Get all dishes from current restaurant from Firestore on page load
    useEffect(() => {
        const unsubscribe = () => {
            const handleGetData = async () => {
                const price = await getPriceById(item.priceId);
                const dish = await getDishById(price.dishId);
                const size = await getSizeById(price.sizeId);

                setPrice(price);
                setDish(dish);
                setSize(size);
                setAmount(item.amount);
                setLoading(false);
            };

            handleGetData();
        };

        // Stop listening to changes
        return unsubscribe();
    }, [getPriceById, getDishById, getSizeById, item]);

    return (
        <div className="col-12 col-md-6">
            {!loading && (
                <div className="order-content-list--item card d-flex flex-row justify-content-between align-items-center">
                    <div className="item-info d-flex flex-row align-items-center">
                        <div className="thumbnail">
                            <img src={dish.thumbnail.url} alt={dish.name} />
                        </div>
                        <div className="info">
                            <div>
                                <h4 className="info-title">{dish.name}</h4>
                                <p>{size.name}</p>
                            </div>
                            <h4 className="info-price highlight">
                                {item.amount} x €{price.price}
                            </h4>
                        </div>
                    </div>
                    {(status === "Not yet placed" ||
                        status === "Declined" ||
                        status === "Picked up") && (
                        <Fragment>
                            <div className="item-btns d-flex flex-column">
                                <button
                                    type="button"
                                    onClick={() => handleOpenPopup("edit")}
                                    className="edit-item small"
                                >
                                    <Feather.Edit />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleOpenPopup("delete")}
                                    className="delete-item danger small"
                                >
                                    <Feather.Trash2 />
                                </button>
                            </div>
                            <Popup
                                popupId={`edit-item-${item.priceId}`}
                                title={`Edit ${dish.name}`}
                                formId={`edit-item-form-${item.priceId}`}
                                handleSubmit={(ev) => handleSubmit(ev, "edit")}
                            >
                                <div className="form-item">
                                    <label htmlFor="amount">
                                        Select amount
                                    </label>
                                    <input
                                        type="number"
                                        name="amount"
                                        required
                                        min={1}
                                        max={10}
                                        value={amount}
                                        onChange={(ev) =>
                                            setAmount(ev.target.value)
                                        }
                                    />
                                </div>
                                {editItemError ? (
                                    <span className="error">
                                        <Feather.AlertCircle /> {editItemError}
                                    </span>
                                ) : (
                                    ""
                                )}
                            </Popup>
                            <Popup
                                popupId={`delete-item-${item.priceId}`}
                                title="Are you sure you want to delete this item?"
                                description={`${item.amount} x ${dish.name} (${size.name})`}
                                formId={`delete-item-form-${item.priceId}`}
                                handleSubmit={(ev) =>
                                    handleSubmit(ev, "delete")
                                }
                            >
                                {deleteItemError ? (
                                    <span className="error">
                                        <Feather.AlertCircle />{" "}
                                        {deleteItemError}
                                    </span>
                                ) : (
                                    ""
                                )}
                            </Popup>
                        </Fragment>
                    )}
                </div>
            )}
        </div>
    );
};

export default OrderItemCard;
