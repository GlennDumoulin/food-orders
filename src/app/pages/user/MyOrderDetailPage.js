// Imports
import React, { useState, useEffect, Fragment } from "react";
import { useParams } from "react-router-dom";
import {
    MuiPickersUtilsProvider,
    KeyboardTimePicker,
} from "@material-ui/pickers";
import "date-fns";
import DateFnsUtils from "@date-io/date-fns";
import * as Feather from "react-feather";

import { OrderItemCard } from "../../components/cards";
import { Popup } from "../../components/popup";
import * as Routes from "../../routes";
import { useFirebase, useFirestore } from "../../services";

import "./MyOrderDetailPage.scss";

// Page content
export const MyOrderDetailPage = ({ children }) => {
    // Defining variables and states
    const { app } = useFirebase();
    const db = app.firestore();
    const { id } = useParams();
    const {
        getRestaurantById,
        getPriceById,
        getCurrentOrder,
        updateOrderStatus,
        updateOrderPickup,
        deleteOrder,
        user,
    } = useFirestore();

    const [order, setOrder] = useState();
    const [restaurant, setRestaurant] = useState();
    const [totalPrice, setTotalPrice] = useState();
    const [loading, setLoading] = useState(true);
    const [pickup, setPickup] = useState(new Date());
    const [restaurantError, setRestaurantError] = useState("");
    const [placeOrderError, setPlaceOrderError] = useState("");
    const [deleteOrderError, setDeleteOrderError] = useState("");
    const [cancelOrderError, setCancelOrderError] = useState("");

    /**
     * Handle opening a popup & disable scrolling
     * @param {String} action
     */
    const handleOpenPopup = (action) => {
        const popup = document.getElementById(`${action}-order`);
        popup.classList.remove("hidden");

        const body = document.body;
        body.style.overflowX = "hidden";
        body.style.overflowY = "hidden";
    };

    /**
     * Handle submitting place/delete/cancel of an order to Firestore
     * @param {Event} ev
     * @param {String} action
     * @returns null|error
     */
    const handleSubmit = async (ev, action) => {
        ev.preventDefault();

        try {
            if (action === "place") {
                // Get the formdata
                const placeOrderForm =
                    document.getElementById("place-order-form");
                const formData = new FormData(placeOrderForm);
                const pickup = formData.get("pickup");

                // Get pickup time in milliseconds
                const today = new Date();
                const pickupMillis = new Date(
                    `${
                        today.getMonth() + 1
                    }/${today.getDate()}/${today.getFullYear()} ${pickup}`
                ).getTime();

                // Update pickup time and status of current order in Firestore
                await updateOrderStatus(order.id, "Awaiting acceptance");
                await updateOrderPickup(order.id, pickupMillis);

                // Close the popup & enable scrolling
                const popup = document.getElementById("place-order");
                popup.classList.add("hidden");

                const body = document.body;
                body.style.overflowX = "hidden";
                body.style.overflowY = "auto";
            }
            if (action === "delete") {
                // Delete the order from Firstore
                await deleteOrder(order.id);

                // Enable scrolling & redirect to my orders page
                const body = document.body;
                body.style.overflowX = "hidden";
                body.style.overflowY = "auto";

                window.location.assign(Routes.MY_ORDERS);
            }
            if (action === "cancel") {
                // Check if the user already has an order that is not yet placed
                const currentOrder = await getCurrentOrder(user.uid);
                if (currentOrder[0]) {
                    setCancelOrderError(
                        "You already have an order that is not yet placed. Please place or delete that order before cancelling this one."
                    );
                } else {
                    // Update status of current order in Firestore
                    await updateOrderStatus(order.id, "Not yet placed");

                    // Close the popup & enable scrolling
                    const popup = document.getElementById("cancel-order");
                    popup.classList.add("hidden");

                    const body = document.body;
                    body.style.overflowX = "hidden";
                    body.style.overflowY = "auto";
                }
            }
        } catch (error) {
            if (action === "place") setPlaceOrderError(error.message);
            if (action === "delete") setDeleteOrderError(error.message);
            if (action === "cancel") setCancelOrderError(error.message);
        }
    };

    // Display the pickup time for the current order
    const displayPickupTime = () => {
        // Get pickup time from order
        const pickupAt = new Date(order.pickupAt);
        const day = pickupAt.getDate();
        const month = pickupAt.getMonth();
        const hours = pickupAt.getHours();
        const minutes = pickupAt.getMinutes();

        /**
         * Add a zero in front of the value if it is smaller than 10
         * @param {Number} value
         * @returns value
         */
        const addZero = (value) => {
            if (value < 10) {
                return "0" + value;
            } else {
                return value;
            }
        };

        // Set text to display
        return `${addZero(day)}/${addZero(month + 1)} at ${addZero(
            hours
        )}:${addZero(minutes)}`;
    };

    // Get all dishes from current restaurant on page load and update on change
    useEffect(() => {
        const handleGetData = async (order) => {
            const restaurant = await getRestaurantById(order.restaurantId);

            // Calculate the total price of the order
            let orderTotal = 0;
            order.orderContent.forEach(async (item) => {
                const price = await getPriceById(item.priceId);

                const itemPrice = price.price * item.amount;

                orderTotal += itemPrice;
                setTotalPrice(orderTotal.toFixed(2));
            });

            // Set a warning when the restaurant is not accepting orders
            if (!restaurant.acceptingOrders) {
                setRestaurantError(
                    "This restaurant is currently not accepting any new orders."
                );
            }

            setRestaurant(restaurant);
            setLoading(false);
        };

        const unsubscribe = () => {
            db.collection("orders")
                .doc(id)
                .onSnapshot((doc) => {
                    const order = {
                        id: doc.id,
                        ...doc.data(),
                    };

                    setOrder(order);
                    handleGetData(order);
                });
        };

        // Stop listening to changes
        return unsubscribe;
    }, [db, id, getPriceById, getRestaurantById]);

    // Redirect if the order does not exist
    if (!loading && !order.id) window.location.assign(Routes.MY_ORDERS);

    return (
        <div className="page page--my-order-detail">
            {!loading && (
                <Fragment>
                    <div className="back-btn">
                        <Feather.ArrowLeftCircle
                            onClick={() =>
                                window.location.assign(Routes.MY_ORDERS)
                            }
                            className="btn-icon"
                        />
                    </div>
                    {restaurantError ? (
                        <span className="error">
                            <Feather.AlertCircle /> {restaurantError}
                        </span>
                    ) : (
                        ""
                    )}
                    <h1 className="no-margin">{restaurant.name}</h1>
                    <h3>
                        {restaurant.address}, <br /> {restaurant.postalCode}{" "}
                        {restaurant.city}
                    </h3>
                    <h4 className="status highlight">{order.status}</h4>
                    <div className="order-content-list row">
                        {order.orderContent.length > 0 &&
                            order.orderContent.map((item) => (
                                <OrderItemCard
                                    item={item}
                                    status={order.status}
                                    key={item.priceId}
                                />
                            ))}
                        {(order.status === "Not yet placed" ||
                            order.status === "Declined" ||
                            order.status === "Picked up") && (
                            <div className="col-12 col-md-6">
                                <div className="order-content-list--item">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            window.location.assign(
                                                Routes.RESTAURANT_MENU.replace(
                                                    ":id",
                                                    order.restaurantId
                                                )
                                            )
                                        }
                                        className="fill"
                                    >
                                        <Feather.Plus /> Add more
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                    <h4 className="total-price">
                        Total price:{" "}
                        <span className="highlight">€{totalPrice}</span>
                    </h4>
                    {order.status !== "Not yet placed" && (
                        <h4 className="pickup">
                            Pickup:{" "}
                            <span className="highlight">
                                {displayPickupTime()}
                            </span>
                        </h4>
                    )}
                    {(order.status === "Not yet placed" ||
                        order.status === "Declined" ||
                        order.status === "Picked up") && (
                        <div className="btns-container row">
                            <div className="col-6">
                                <button
                                    type="button"
                                    onClick={() => handleOpenPopup("delete")}
                                    className="danger fill"
                                >
                                    Delete order
                                </button>
                            </div>
                            <div className="col-6">
                                <button
                                    type="button"
                                    onClick={() => handleOpenPopup("place")}
                                    className="fill"
                                >
                                    Place order
                                </button>
                            </div>
                            <Popup
                                popupId="place-order"
                                title="Place order"
                                formId="place-order-form"
                                handleSubmit={(ev) => handleSubmit(ev, "place")}
                            >
                                <div className="form-item time-picker">
                                    <label htmlFor="pickup">
                                        Select the time
                                    </label>
                                    <MuiPickersUtilsProvider
                                        utils={DateFnsUtils}
                                    >
                                        <KeyboardTimePicker
                                            id="pikcup"
                                            name="pickup"
                                            minutesStep={5}
                                            value={pickup}
                                            onChange={(date) => setPickup(date)}
                                        />
                                    </MuiPickersUtilsProvider>
                                </div>
                                {placeOrderError ? (
                                    <span className="error">
                                        <Feather.AlertCircle />{" "}
                                        {placeOrderError}
                                    </span>
                                ) : (
                                    ""
                                )}
                            </Popup>
                            <Popup
                                popupId="delete-order"
                                title="Are you sure you want to delete this order?"
                                formId="delete-order-form"
                                handleSubmit={(ev) =>
                                    handleSubmit(ev, "delete")
                                }
                            >
                                {deleteOrderError ? (
                                    <span className="error">
                                        <Feather.AlertCircle />{" "}
                                        {deleteOrderError}
                                    </span>
                                ) : (
                                    ""
                                )}
                            </Popup>
                        </div>
                    )}
                    {order.status === "Awaiting acceptance" && (
                        <div className="btns-container row">
                            <div className="col-12">
                                <button
                                    type="button"
                                    onClick={() => handleOpenPopup("cancel")}
                                    className="danger fill"
                                >
                                    Cancel order
                                </button>
                            </div>
                            <Popup
                                popupId="cancel-order"
                                title="Are you sure you want to cancel this order?"
                                description="After cancelling you can edit your order and place it again when you are ready."
                                formId="cancel-order-form"
                                handleSubmit={(ev) =>
                                    handleSubmit(ev, "cancel")
                                }
                            >
                                {cancelOrderError ? (
                                    <span className="error">
                                        <Feather.AlertCircle />{" "}
                                        {cancelOrderError}
                                    </span>
                                ) : (
                                    ""
                                )}
                            </Popup>
                        </div>
                    )}
                </Fragment>
            )}
        </div>
    );
};
