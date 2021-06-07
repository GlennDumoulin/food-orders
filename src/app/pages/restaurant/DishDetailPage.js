// Imports
import React, { useState, useEffect, Fragment } from "react";
import { useParams } from "react-router-dom";
import Switch from "@material-ui/core/Switch";
import * as Feather from "react-feather";

import { Popup } from "../../components/popup";
import * as Routes from "../../routes";
import { useFirestore } from "../../services";

import "./DishDetailPage.scss";

// Page content
export const DishDetailPage = () => {
    // Define variables and states
    const { id } = useParams();
    const { getDishById, updateDishAvailablity, deleteDish } = useFirestore();

    const [dish, setDish] = useState();
    const [loading, setLoading] = useState(true);
    const [available, setAvailable] = useState();

    // Handle switch changes
    const handleSwitch = async () => {
        // Change status
        setAvailable(!available);

        // Update dish availability in Firestore
        await updateDishAvailablity(dish.id, !available);

        // Get dish data from Firestore and set current dish
        const updatedDish = await getDishById(dish.id);
        setDish(updatedDish);
    };

    // Handle opening delete dish popup & disable scrolling
    const handleDeletePopup = () => {};

    // Handle deleting a dish from Firestore
    const handleDeleteDish = async () => {
        // Delete thumbnail from Cloud Storage
        // ...

        // Get all prices for current dish
        // ...

        // Delete all prices for current dish
        // ...

        // Delete dish from Firestore
        await deleteDish(dish.id);
    };

    // Get current dish from Firestore on page load
    useEffect(() => {
        const unsubscribe = () => {
            const handleGetDish = async () => {
                const dish = await getDishById(id);
                console.log(dish);

                setDish(dish);
                setAvailable(dish.available);
                setLoading(false);
            };

            handleGetDish();
        };

        // Stop listening to changes
        unsubscribe();
    }, [getDishById, id]);

    if (!loading && !dish.name) window.location.assign(Routes.OUR_MENU);

    return (
        <div className="page page--dish-detail">
            {!loading && (
                <Fragment>
                    <div className="back-btn">
                        <Feather.ArrowLeftCircle
                            onClick={() =>
                                window.location.assign(Routes.OUR_MENU)
                            }
                            className="btn-icon"
                        />
                    </div>
                    <h1>{dish.name}</h1>
                    <div className="dish-management d-flex justify-content-between align-items-center">
                        <div className="form-item switch">
                            <label htmlFor="available">Available</label>
                            <Switch
                                checked={available}
                                onChange={handleSwitch}
                                name="available"
                                id="available"
                            />
                        </div>
                        <button
                            type="button"
                            onClick={handleDeletePopup}
                            className="danger"
                        >
                            Delete dish
                        </button>
                    </div>
                </Fragment>
            )}
        </div>
    );
};
