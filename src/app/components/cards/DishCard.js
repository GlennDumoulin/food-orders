// Imports
import React, { useState, useEffect, Fragment } from "react";
import * as Feather from "react-feather";

import { DishCardOption } from "../../components/cards";
import { Popup } from "../../components/popup";
import { useFirestore } from "../../services";

// Dish card content
const DishCard = ({ dish, restaurant }) => {
    // Defining variables and states
    const {
        getPricesByDishId,
        getCurrentOrder,
        getOrderById,
        addOrder,
        addOrderContent,
        deleteOrder,
        user,
        loading,
    } = useFirestore();

    const [prices, setPrices] = useState();
    const [order, setOrder] = useState();
    const [loadingData, setLoadingData] = useState(true);
    const [size, setSize] = useState();
    const [dishError, setDishError] = useState("");
    const [dishSuccess, setDishSuccess] = useState("");
    const [orderError, setOrderError] = useState("");

    /**
     * Handle opening a dish popup & disable scrolling
     * @param {Id} id
     */
    const handlePopup = async () => {
        // Remove notifications
        setDishError("");
        setDishSuccess("");

        const popup = document.getElementById(`dish-${dish.id}`);
        popup.classList.remove("hidden");

        const body = document.body;
        body.style.overflowX = "hidden";
        body.style.overflowY = "hidden";
    };

    // Handle adding dish to order
    const handleSubmit = async (ev) => {
        ev.preventDefault();

        // Get the formdata
        const dishForm = document.getElementById(`dish-form-${dish.id}`);
        const formData = new FormData(dishForm);

        // Get the formdata values
        let values = [];
        for (let value of formData.values()) {
            values.push(value);
        }

        try {
            // Check if there already is an order
            if (order) {
                // Check if the order's restaurant is the same as the current restaurant
                if (order.restaurantId !== restaurant.id) {
                    // Delete current order from Firestore
                    await deleteOrder(order.id);

                    // Set initial order content
                    const orderContent = [
                        {
                            priceId: values[0],
                            amount: parseInt(values[1]),
                        },
                    ];

                    // Add new order to Firestore
                    const orderId = await addOrder(
                        user.uid,
                        restaurant.id,
                        orderContent
                    );

                    // Get order from Firestore and set current order
                    const newOrder = await getOrderById(orderId);
                    setOrder(newOrder);

                    // Set success message
                    setDishError("");
                    setDishSuccess(
                        "This item has been added to your new order"
                    );
                    setOrderError("");
                } else {
                    // Check if the current dish is already in the order
                    if (
                        order.orderContent.find(
                            (item) => item.priceId === values[0]
                        )
                    ) {
                        // Set error message
                        setDishSuccess("");
                        setDishError(
                            "This item is already in your order, go to this order to change the amount"
                        );
                    } else {
                        // Set order content item
                        const item = {
                            priceId: values[0],
                            amount: values[1],
                        };

                        // Add dish to current order in Firestore
                        await addOrderContent(order.id, item);

                        // Get order from Firestore and set current order
                        const updatedOrder = await getOrderById(order.id);
                        setOrder(updatedOrder);

                        // Set success message
                        setDishError("");
                        setDishSuccess(
                            "This item has been added to your order"
                        );
                    }
                }
            } else {
                // Set initial order content
                const orderContent = [
                    {
                        priceId: values[0],
                        amount: parseInt(values[1]),
                    },
                ];

                // Add a new order to Firestore
                const orderId = await addOrder(
                    user.uid,
                    restaurant.id,
                    orderContent
                );

                // Get order from Firestore and set current order
                const order = await getOrderById(orderId);
                setOrder(order);

                // Set success message
                setDishError("");
                setDishSuccess("This item has been added to your order");
            }
        } catch (error) {
            setDishSuccess("");
            setDishError(error.message);
        }
    };

    // Get all prices from current dish from Firestore on page load
    useEffect(() => {
        const unsubscribe = () => {
            const handleGetData = async () => {
                // Get all prices for current dish
                const prices = await getPricesByDishId(dish.id);

                let order = {};
                if (!loading) {
                    // Get current order
                    order = await getCurrentOrder(user.uid);
                }

                // Set error message if current order is from a different restaurant
                if (order[0] && order[0].restaurantId !== restaurant.id) {
                    setOrderError(
                        "Adding this item will delete your current order and start a new one for this restaurant."
                    );
                }

                // Set current prices and order
                setPrices(prices);
                setOrder(order[0]);
                setLoadingData(false);
            };

            handleGetData();
        };

        // Stop listening to changes
        return unsubscribe();
    }, [getPricesByDishId, dish, getCurrentOrder, loading, user, restaurant]);

    // Set first option of each select as selected
    if (!loadingData) {
        const selects = document.querySelectorAll("select");
        selects.forEach((select) => {
            const allOptions = [...select.options];
            allOptions.sort((a, b) => a.dataset.order - b.dataset.order);

            allOptions.forEach((option) => {
                select.options.add(option);
            });

            if (allOptions[0]) {
                select.value = allOptions[0].value;
            }
        });
    }

    return (
        <div className="col-6 col-md-4 col-lg-3">
            {!loadingData && (
                <Fragment>
                    <div className="card" onClick={() => handlePopup()}>
                        <img
                            src={dish.thumbnail.url}
                            alt={dish.name}
                            className="card-thumbnail"
                        />
                        <div className="overlay"></div>
                        <h3 className="card-title">{dish.name}</h3>
                    </div>
                    <Popup
                        popupId={`dish-${dish.id}`}
                        title={dish.name}
                        description={dish.description}
                        leftBtn={{
                            type: "danger",
                            cols: 5,
                            name: "Close",
                        }}
                        rightBtn={{
                            type: "",
                            cols: 7,
                            name: "Add to order",
                        }}
                        formId={`dish-form-${dish.id}`}
                        handleSubmit={(ev) => handleSubmit(ev)}
                        bottomError={orderError}
                    >
                        <div className="form-item">
                            <label htmlFor="size">Select a size</label>
                            <select
                                name="size"
                                required
                                onChange={(ev) => {
                                    setSize(ev.target.value);
                                    setDishError("");
                                    setDishSuccess("");
                                }}
                                value={size}
                            >
                                {!!prices && prices.length > 0 ? (
                                    prices.map((price) => (
                                        <DishCardOption
                                            price={price}
                                            key={price.id}
                                        />
                                    ))
                                ) : (
                                    <option value="">No sizes found</option>
                                )}
                            </select>
                        </div>
                        <div className="form-item">
                            <label htmlFor="amount">Select amount</label>
                            <input
                                type="number"
                                name="amount"
                                required
                                defaultValue={1}
                                min={1}
                                max={10}
                            />
                        </div>
                        {dishError ? (
                            <span className="error">
                                <Feather.AlertCircle /> {dishError}
                            </span>
                        ) : (
                            ""
                        )}
                        {dishSuccess ? (
                            <span className="success">
                                <Feather.CheckCircle /> {dishSuccess}
                            </span>
                        ) : (
                            ""
                        )}
                    </Popup>
                </Fragment>
            )}
        </div>
    );
};

export default DishCard;
