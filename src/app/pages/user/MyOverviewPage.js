// Imports
import React, { useState, useEffect } from "react";

import { OrderCard } from "../../components/cards";
import * as Routes from "../../routes";
import { useFirestore } from "../../services";

import "./MyOverviewPage.scss";

// Page content
export const MyOverviewPage = ({ children }) => {
    // Defining variables and states
    const { getRecentRestaurants, getUpcomingOrders, user, loading } =
        useFirestore();

    const [restaurants, setRestaurants] = useState();
    const [orders, setOrders] = useState();

    // Get the most recent restaurants on page load
    useEffect(() => {
        const unsubscribe = () => {
            const handleGetData = async () => {
                const restaurants = await getRecentRestaurants(3);
                let orders = [];

                if (!loading) {
                    orders = await getUpcomingOrders(user.uid, 2);
                }

                setRestaurants(restaurants);
                setOrders(orders);
            };

            handleGetData();
        };

        // Stop listening to changes
        return unsubscribe();
    }, [getRecentRestaurants, getUpcomingOrders, user, loading]);

    return (
        <div className="page page--my-overview">
            <h1 className="brand">
                Welcome to
                <br />
                <span>F</span>ood<span>O</span>rders
            </h1>
            <h2>Upcoming orders</h2>
            <div className="orders-list row justify-content-between">
                {!!orders && orders.length > 0 ? (
                    orders.map((order) => (
                        <OrderCard
                            order={order}
                            link={Routes.MY_ORDER_DETAIL.replace(
                                ":id",
                                order.id
                            )}
                            key={order.id}
                        />
                    ))
                ) : (
                    <p>No orders found</p>
                )}
            </div>
            <button
                type="button"
                className="fill"
                onClick={() => window.location.assign(Routes.MY_ORDERS)}
            >
                View all orders
            </button>
            <h2>Recent restaurants</h2>
            <div className="restaurants-list row justify-content-between">
                {!!restaurants &&
                    restaurants.length > 0 &&
                    restaurants.map((restaurant) => (
                        <div className="col-4 col-md-3" key={restaurant.id}>
                            <a
                                href={Routes.RESTAURANT_MENU.replace(
                                    ":id",
                                    restaurant.id
                                )}
                            >
                                <div className="restaurants-list--item">
                                    <img
                                        src={restaurant.thumbnail.url}
                                        alt={restaurant.name}
                                    />
                                </div>
                            </a>
                        </div>
                    ))}
            </div>
            <button
                type="button"
                className="fill"
                onClick={() => window.location.assign(Routes.RESTAURANTS)}
            >
                View all restaurants
            </button>
        </div>
    );
};
