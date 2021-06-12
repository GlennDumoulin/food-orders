// Imports
import React, { useState, useEffect } from "react";

import { OrderCard } from "../../components/cards";
import * as Routes from "../../routes";
import { useFirestore } from "../../services";

import "./MyOrdersPage.scss";

// Page content
export const MyOrdersPage = ({ children }) => {
    // Defining variables and states
    const { getOrdersByUser, user, loading } = useFirestore();

    const [orders, setOrders] = useState();

    // Get the most recent restaurants on page load
    useEffect(() => {
        const unsubscribe = () => {
            const handleGetOrders = async () => {
                let orders = [];

                if (!loading) {
                    orders = await getOrdersByUser(user.uid);
                }

                setOrders(orders);
            };

            handleGetOrders();
        };

        // Stop listening to changes
        return unsubscribe();
    }, [getOrdersByUser, user, loading]);

    return (
        <div className="page page--my-orders">
            <h1>My Orders</h1>
            <button
                type="button"
                onClick={() => window.location.assign(Routes.RESTAURANTS)}
                className="fill"
            >
                New order
            </button>
            <div className="orders-list row">
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
        </div>
    );
};
