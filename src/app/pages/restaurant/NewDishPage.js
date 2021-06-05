// Imports
import React, { useState, useEffect } from "react";
import * as Feather from "react-feather";

import { DishInfoForm, DishPricesForm } from "../../components/forms";
import * as Routes from "../../routes";
import { useAuth, useFirestore, useStorage } from "../../services";

import "./NewDishPage.scss";

// Page content
export const NewDishPage = () => {
    // Define variables and states
    const { user } = useAuth();
    const restaurantName = user ? user.displayName : "";
    const restaurantId = user ? user.uid : "";
    const { getDishById, addDish, updateDish, getSizesByRestaurant } =
        useFirestore();
    const { uploadImg } = useStorage();

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
                // Add image to Cloud Storage
                const thumbnailUrl = await uploadImg(
                    "dishes",
                    restaurantName,
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
    });

    return (
        <div className="page page--new-dish row">
            <div className="back-btn">
                <Feather.ArrowLeftCircle
                    onClick={() => window.location.assign(Routes.OUR_MENU)}
                    className="btn-icon"
                />
            </div>
            <h1>New Dish</h1>
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
                    handleSubmit={handlePricesSubmit}
                />
                <span className="error">{pricesError}</span>
                <span className="success">{pricesSuccess}</span>
            </div>
        </div>
    );
};
