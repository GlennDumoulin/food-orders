// Imports
import React, { useState, useEffect, Fragment } from "react";
import { useParams } from "react-router-dom";
import * as Feather from "react-feather";

import { DishCard } from "../../components/cards";
import * as Routes from "../../routes";
import { useFirestore } from "../../services";

import "./RestaurantMenuPage.scss";

// Page content
export const RestaurantMenuPage = ({ children }) => {
    // Defining variables and states
    const { id } = useParams();
    const { getRestaurantById, getDishesByRestaurant } = useFirestore();

    const [restaurant, setRestaurant] = useState();
    const [dishes, setDishes] = useState();
    const [loading, setLoading] = useState(true);

    // Get all dishes from current restaurant from Firestore on page load
    useEffect(() => {
        const unsubscribe = () => {
            const handleGetData = async () => {
                const restaurant = await getRestaurantById(id);
                const dishes = await getDishesByRestaurant(id);

                setRestaurant(restaurant);
                setDishes(dishes);
                setLoading(false);
            };

            handleGetData();
        };

        // Stop listening to changes
        return unsubscribe();
    }, [getRestaurantById, getDishesByRestaurant, id]);

    if (!loading && !restaurant.name)
        window.location.assign(Routes.RESTAURANTS);

    return (
        <div className="page page--restaurant-menu">
            {!loading && (
                <Fragment>
                    <div className="back-btn">
                        <Feather.ArrowLeftCircle
                            onClick={() =>
                                window.location.assign(Routes.RESTAURANTS)
                            }
                            className="btn-icon"
                        />
                    </div>
                    <h1 className="no-margin">{restaurant.name}</h1>
                    <h3>
                        {restaurant.address}, <br /> {restaurant.postalCode}{" "}
                        {restaurant.city}
                    </h3>
                    {restaurant.acceptingOrders ? (
                        <div className="dishes-list row">
                            {!!dishes && dishes.length > 0 ? (
                                dishes.map((dish) => {
                                    return (
                                        <DishCard
                                            dish={dish}
                                            restaurant={restaurant}
                                            key={dish.id}
                                        />
                                    );
                                })
                            ) : (
                                <h3>No dishes found</h3>
                            )}
                        </div>
                    ) : (
                        <p>
                            We are currently not accepting any orders. Please
                            try again later.
                        </p>
                    )}
                </Fragment>
            )}
        </div>
    );
};
