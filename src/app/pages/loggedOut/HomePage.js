// Imports
import React, { useState, useEffect } from "react";

import * as Routes from "../../routes";
import { useFirestore } from "../../services";

import "./HomePage.scss";

// Page content
export const HomePage = ({ children }) => {
    // Defining variables and states
    const { getRecentRestaurants } = useFirestore();

    const [restaurants, setRestaurants] = useState();

    // Get the most recent restaurants on page load
    useEffect(() => {
        const unsubscribe = () => {
            const handleGetRestaurants = async () => {
                const restaurants = await getRecentRestaurants(3);

                setRestaurants(restaurants);
            };

            handleGetRestaurants();
        };

        // Stop listening to changes
        return unsubscribe();
    }, [getRecentRestaurants]);

    return (
        <div className="page page--home">
            <h1 className="brand">
                Welcome to
                <br />
                <span>F</span>ood<span>O</span>rders
            </h1>
            <p>
                Our goal is to create a platform where people can browse through
                various different restaurants and order the food they want. Here
                you can see a few restaurants who recently joined the party.
            </p>
            <div className="restaurants-list row justify-content-between">
                {!!restaurants &&
                    restaurants.length > 0 &&
                    restaurants.map((restaurant) => (
                        <div className="col-4 col-md-3" key={restaurant.id}>
                            <div className="restaurants-list--item">
                                <img
                                    src={restaurant.thumbnail.url}
                                    alt={restaurant.name}
                                />
                            </div>
                        </div>
                    ))}
            </div>
            <h2>Let's get started!</h2>
            <p>
                Do you want to order food and choose between a diversity of
                restaurants or do you want to offer our users some food to order
                and enjoy?
            </p>
            <button
                type="button"
                className="fill"
                onClick={() => window.location.assign(Routes.REGISTER_LOGIN)}
            >
                Create an account or login here
            </button>
        </div>
    );
};
