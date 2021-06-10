// Imports
import React, { useState, useEffect } from "react";

import { useFirestore } from "../../services";

// Order card content
const OrderCard = ({ order, link }) => {
    // Defining variables and states
    const { getRestaurantById } = useFirestore();

    const [restaurant, setRestaurant] = useState();
    const [loading, setLoading] = useState(true);

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
                            <h5>{order.pickupAt}</h5>
                            <h4>{restaurant.name}</h4>
                        </div>
                    </div>
                </a>
            )}
        </div>
    );
};

export default OrderCard;
