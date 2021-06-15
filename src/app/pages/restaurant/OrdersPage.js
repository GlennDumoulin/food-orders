// Imports
import React, { useState, useEffect } from "react";
import Switch from "@material-ui/core/Switch";

import { useFirestore } from "../../services";

import "./OrdersPage.scss";

// Page content
export const OrdersPage = ({ children }) => {
    // Defining variables and states
    const { getRestaurantById, updateRestaurantAvailability, user, loading } =
        useFirestore();

    const [restaurant, setRestaurant] = useState();
    const [available, setAvailable] = useState();
    const [loadingData, setLoadingData] = useState(true);

    // Handle switch changes
    const handleSwitch = async () => {
        // Change status
        setAvailable(!available);

        // Update restaurant availability in Firestore
        await updateRestaurantAvailability(restaurant.id, !available);

        // Get restaurant data from Firestore and set current restaurant
        const updatedDish = await getRestaurantById(restaurant.id);
        setRestaurant(updatedDish);
    };

    // Get current restaurant from Firestore on page load
    useEffect(() => {
        const unsubscribe = () => {
            const handleGetData = async () => {
                if (!loading) {
                    const restaurant = await getRestaurantById(user.uid);

                    setRestaurant(restaurant);
                    setAvailable(restaurant.acceptingOrders);
                    setLoadingData(false);
                }
            };

            handleGetData();
        };

        // Stop listening to changes
        return unsubscribe();
    }, [getRestaurantById, user, loading]);

    return (
        <div className="page page--orders">
            <h1>Orders</h1>
            {!loadingData && (
                <div className="form-item switch">
                    <label htmlFor="available">Accepting orders</label>
                    <Switch
                        checked={available}
                        onChange={handleSwitch}
                        name="available"
                        id="available"
                    />
                </div>
            )}
        </div>
    );
};
