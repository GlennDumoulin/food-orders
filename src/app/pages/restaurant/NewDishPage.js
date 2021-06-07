// Imports
import React, { useState, useEffect } from "react";
import * as Feather from "react-feather";

import { DishInfoForm, DishPricesForm } from "../../components/forms";
import * as Routes from "../../routes";
import { useFirestore, useStorage } from "../../services";

import "./NewDishPage.scss";

// Page content
export const NewDishPage = () => {
    // Define variables and states
    const {
        getDishById,
        addDish,
        updateDish,
        getPriceById,
        addPrice,
        updatePrice,
        deletePrice,
        getSizesByRestaurant,
        user,
    } = useFirestore();
    const restaurantName = user ? user.displayName : "";
    const restaurantId = user ? user.uid : "";
    const { uploadImg, deleteImg } = useStorage();

    const [sizes, setSizes] = useState();
    const [dish, setDish] = useState();
    const [infoError, setInfoError] = useState("");
    const [infoSuccess, setInfoSuccess] = useState("");
    const [prices, setPrices] = useState();
    const [pricesError, setPricesError] = useState("");
    const [pricesSuccess, setPricesSuccess] = useState("");

    /**
     * Handle saving info changes
     * @param {Object} formData
     * @returns null|error
     */
    const handleInfoSubmit = async ({ name, description, thumbnail }) => {
        // If there is already a dish added, edit that dish
        if (!dish) {
            try {
                // Add image to Cloud Storage
                const thumbnailUrl = await uploadImg(
                    "dishes",
                    restaurantName,
                    name,
                    thumbnail
                );

                // Add dish to Firestore
                const dishId = await addDish(
                    name,
                    description,
                    thumbnailUrl,
                    restaurantId
                );

                // Get dish data from Firestore and set current dish
                const newDish = await getDishById(dishId);
                setDish(newDish);

                // Set success message
                setInfoError("");
                setInfoSuccess("This dish was saved succesfully");
            } catch (error) {
                setInfoSuccess("");
                setInfoError(error.message);
            }
        } else {
            try {
                // Delete previous image from Cloud Storage
                await deleteImg("dishes", restaurantName, dish.name);

                // Add image to Cloud Storage
                const thumbnailUrl = await uploadImg(
                    "dishes",
                    restaurantName,
                    name,
                    thumbnail
                );

                // Update dish in Firestore
                await updateDish(dish.id, name, description, thumbnailUrl);

                // Get dish data from Firestore and set current dish
                const updatedDish = await getDishById(dish.id);
                setDish(updatedDish);

                // Set success message
                setInfoError("");
                setInfoSuccess("This dish was updated succesfully");
            } catch (error) {
                setInfoSuccess("");
                setInfoError(error.message);
            }
        }
    };

    // Handle saving prices changes
    const handlePricesSubmit = async (ev) => {
        ev.preventDefault();

        // Get the formdata
        const pricesForm = document.getElementById("dish-prices");
        const formData = new FormData(pricesForm);

        // Get the formdata values
        let values = [];
        for (let value of formData.values()) {
            values.push(value);
        }

        // If there are already prices added, edit those prices
        if (!prices) {
            try {
                // Check if there is at least one value
                if (values.length > 0) {
                    let i = 0;
                    let currentPrices = [];

                    do {
                        // Add price to FireStore
                        const priceId = await addPrice(
                            dish.id,
                            values[i],
                            parseFloat(values[i + 1])
                        );

                        // Get price data from Firestore and add to prices array
                        const newPrice = await getPriceById(priceId);
                        currentPrices.push(newPrice);

                        // Skip 1 index for next iteration
                        i += 2;
                    } while (i < values.length - 1);

                    // Set current prices
                    setPrices(currentPrices);

                    // Set success message
                    setPricesError("");
                    setPricesSuccess(
                        "The prices for this dish were saved succesfully"
                    );
                } else {
                    // Set error message
                    setPricesSuccess("");
                    setPricesError("Add at least 1 price to your dish");
                }
            } catch (error) {
                setPricesSuccess("");
                setPricesError(error.message);
            }
        } else {
            try {
                // Check if there is at least one value
                if (values.length > 0) {
                    let updatedPrices = [];
                    let formValues = values;
                    let currentPrices = prices;

                    // Check all restaurant sizes if they have a price or not, then check
                    // submitted form for that size and update, delete or create depending on result
                    sizes.map(async (size) => {
                        // Search price in current prices array
                        const price = currentPrices.find((price) => {
                            return (
                                price.dishId === dish.id &&
                                price.sizeId === size.id
                            );
                        });

                        if (price) {
                            // Get the index of the sizeId from the submitted form data
                            const valuesIndex = formValues.findIndex(
                                (value) => {
                                    return value === price.sizeId;
                                }
                            );

                            if (valuesIndex !== -1) {
                                // If price and valuesIndex exist update price in Firestore
                                await updatePrice(
                                    price.id,
                                    parseFloat(formValues[valuesIndex + 1])
                                );

                                // Get price data from Firestore and add to prices array
                                const updatedPrice = await getPriceById(
                                    price.id
                                );
                                updatedPrices.push(updatedPrice);

                                // Remove items from formdata array
                                formValues.splice(valuesIndex, 2);
                            } else {
                                // If price exists delete price from Firestore
                                await deletePrice(price.id);
                            }
                        } else {
                            // Get the index of the sizeId from the submitted form data
                            const valuesIndex = formValues.findIndex(
                                (value) => {
                                    return value === size.id;
                                }
                            );

                            if (valuesIndex !== -1) {
                                // If valuesIndex exists add price to FireStore
                                const priceId = await addPrice(
                                    dish.id,
                                    formValues[valuesIndex],
                                    parseFloat(formValues[valuesIndex + 1])
                                );

                                // Get price data from Firestore and add to prices array
                                const newPrice = await getPriceById(priceId);
                                updatedPrices.push(newPrice);
                            }
                        }
                    });

                    // Set current prices
                    setPrices(updatedPrices);

                    // Set success message
                    setPricesError("");
                    setPricesSuccess(
                        "The prices for this dish were updated succesfully"
                    );
                } else {
                    // Set error message
                    setPricesSuccess("");
                    setPricesError("Add at least 1 price to your dish");
                }
            } catch (error) {
                setPricesSuccess("");
                setPricesError(error.message);
            }
        }
    };

    // Get all sizes from the current restaurant on page load
    useEffect(() => {
        const unsubscribe = () => {
            const handleGetSizes = async () => {
                const sizes = await getSizesByRestaurant(restaurantId);

                setSizes(sizes);
            };

            handleGetSizes();
        };

        // Stop listening to changes
        unsubscribe();
    }, [getSizesByRestaurant, restaurantId]);

    return (
        <div className="page page--new-dish">
            <div className="back-btn">
                <Feather.ArrowLeftCircle
                    onClick={() => window.location.assign(Routes.OUR_MENU)}
                    className="btn-icon"
                />
            </div>
            <h1>New Dish</h1>
            {!!sizes ? (
                <div className="dish-container row">
                    <div className="section col-12 col-md-6">
                        <h2>Info</h2>
                        <DishInfoForm handleSubmit={handleInfoSubmit} />
                        <span className="error">{infoError}</span>
                        <span className="success">{infoSuccess}</span>
                    </div>
                    <div className="section col-12 col-md-6">
                        <h2>Prices</h2>
                        <DishPricesForm
                            sizes={sizes}
                            dish={dish}
                            handleSubmit={handlePricesSubmit}
                        />
                        <span className="error">{pricesError}</span>
                        <span className="success">{pricesSuccess}</span>
                    </div>
                </div>
            ) : (
                <div className="no-sizes">
                    <h3>No sizes found</h3>
                    <p>Please manage your sizes before adding dishes.</p>
                    <button
                        type="button"
                        onClick={() =>
                            window.location.assign(Routes.MANAGE_SIZES)
                        }
                        className="fill"
                    >
                        Start managing my sizes
                    </button>
                </div>
            )}
        </div>
    );
};
