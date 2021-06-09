// Imports
import React, { useState, useEffect } from "react";

import * as Routes from "../../routes";
import { useFirestore } from "../../services";

import "./RestaurantsPage.scss";

// Page content
export const RestaurantsPage = ({ children }) => {
    // Defining variables and states
    const { getRestaurants } = useFirestore();

    const [restaurants, setRestaurants] = useState();

    // Get all available restaurants on page load
    useEffect(() => {
        const unsubscribe = () => {
            const handleGetRestaurants = async () => {
                const restaurants = await getRestaurants();

                setRestaurants(restaurants);
            };

            handleGetRestaurants();
        };

        // Stop listening to changes
        return unsubscribe();
    }, [getRestaurants]);

    return (
        <div className="page page--restaurants">
            <h1>Restaurants</h1>
            <div className="restaurants-list row">
                {!!restaurants && restaurants.length > 0 ? (
                    restaurants.map((restaurant) => (
                        <div
                            className="col-6 col-md-4 col-lg-3"
                            key={restaurant.id}
                        >
                            <a
                                href={Routes.RESTAURANT_MENU.replace(
                                    ":id",
                                    restaurant.id
                                )}
                                className="restaurants-list--item"
                            >
                                <div className="card">
                                    <img
                                        src={restaurant.thumbnail.url}
                                        alt={restaurant.name}
                                        className="card-thumbnail"
                                    />
                                    <div className="overlay"></div>
                                    <h3 className="card-title">
                                        {restaurant.name}
                                    </h3>
                                </div>
                            </a>
                        </div>
                    ))
                ) : (
                    <p>
                        There are currently no restaurants available. Please
                        come back later.
                    </p>
                )}
            </div>
        </div>
    );
};
