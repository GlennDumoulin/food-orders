// Imports
import React, { useState, useEffect, Fragment } from "react";

import { Popup } from "../../components/popup";
import { useFirestore } from "../../services";

// Dish card content
const DishCard = ({ dish }) => {
    // Defining variables and states
    const { getPricesByDishId } = useFirestore();

    const [prices, setPrices] = useState();
    const [loading, setLoading] = useState(true);
    const [dishError, setDishError] = useState("");

    /**
     * Handle opening a dish popup
     * @param {Id} id
     */
    const handlePopup = (id) => {
        const popup = document.getElementById(`dish-${id}`);
        popup.classList.remove("hidden");

        const body = document.body;
        body.style.overflowX = "hidden";
        body.style.overflowY = "hidden";
    };

    const handleSubmit = async () => {};

    // Get all prices from current dish from Firestore on page load
    useEffect(() => {
        const unsubscribe = () => {
            const handleGetDishInfo = async () => {
                // Get all prices for current dish
                const prices = await getPricesByDishId(dish.id);

                // Set current prices
                setPrices(prices);
                setLoading(false);
            };

            handleGetDishInfo();
        };

        // Stop listening to changes
        return unsubscribe();
    }, [getPricesByDishId, dish]);

    return (
        <div className="col-6 col-md-4 col-lg-3">
            {!loading && (
                <Fragment>
                    <div className="card" onClick={() => handlePopup(dish.id)}>
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
                        handleSubmit={(ev) => handleSubmit(ev, dish.id)}
                    >
                        <div className="form-item">
                            <label htmlFor="size">Select a size</label>
                            <select name="size" required>
                                {!!prices && prices.length > 0 ? (
                                    prices.map((price) => (
                                        <option value={price.id} key={price.id}>
                                            {price.sizeName} (€{price.price})
                                        </option>
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
                        <span className="error">{dishError}</span>
                    </Popup>
                </Fragment>
            )}
        </div>
    );
};

export default DishCard;
