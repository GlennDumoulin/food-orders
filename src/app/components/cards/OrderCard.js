// Imports
import React, { useState, useEffect } from "react";

import { useFirestore } from "../../services";

import "./OrderCard.scss";

// Order card content
const OrderCard = ({ order, link }) => {
    // Defining variables and states
    const { getRestaurantById } = useFirestore();

    const [restaurant, setRestaurant] = useState();
    const [loading, setLoading] = useState(true);

    // Display the pickup time for the current order
    const displayPickupTime = () => {
        // Get current time
        const currentTime = new Date();
        const currentTimeMillis = currentTime.getTime();

        // Get pickup time from order
        const pickupAt = new Date(order.pickupAt);
        const pickupAtMillis = pickupAt.getTime();
        const hours = pickupAt.getHours();
        const minutes = pickupAt.getMinutes();

        // Get time difference between now and pickup
        const timeTillPickup = new Date(pickupAtMillis - currentTimeMillis);
        const timeTillPickupMillis = timeTillPickup.getTime();
        const hoursTillPickup = timeTillPickup.getHours();
        const miutesTillPickup = timeTillPickup.getMinutes();

        // Set text to display
        if (timeTillPickupMillis < 0) {
            return "";
        } else if (miutesTillPickup < 1) {
            return "Now";
        } else if (hoursTillPickup === 1) {
            return `In ${miutesTillPickup + 1} minutes`;
        } else if (hoursTillPickup <= 5) {
            return `In ${hoursTillPickup} hours`;
        } else {
            return `${hours}:${minutes}`;
        }
    };

    // Get the current order's restaurant on page load
    useEffect(() => {
        const unsubscribe = () => {
            const handleGetRestaurant = async () => {
                const restaurant = await getRestaurantById(order.restaurantId);

                setRestaurant(restaurant);
                setLoading(false);
            };

            handleGetRestaurant();
        };

        // Stop listening to changes
        return unsubscribe();
    }, [getRestaurantById, order]);

    return (
        <div className="col-6 col-md-4 col-lg-3" key={order.id}>
            {!loading && (
                <a href={link} className="orders-list--item">
                    <div className="card">
                        <img
                            src={restaurant.thumbnail.url}
                            alt={restaurant.name}
                        />
                        <div className="overlay"></div>
                        <div className="status-container">
                            <span className="small">{order.status}</span>
                        </div>
                        <div className="info-container">
                            <p className="info-pickup">
                                {order.pickupAt ? displayPickupTime() : ""}
                            </p>
                            <p className="info-restaurant">{restaurant.name}</p>
                        </div>
                    </div>
                </a>
            )}
        </div>
    );
};

export default OrderCard;
