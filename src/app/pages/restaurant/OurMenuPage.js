// Imports
import React, { useState, useEffect } from "react";

import * as Routes from "../../routes";
import { useFirestore } from "../../services";

import "./OurMenuPage.scss";

// Page content
export const OurMenuPage = ({ children }) => {
    // Defining variables and states
    const { getDishesByRestaurant, user } = useFirestore();
    const restaurantId = user ? user.uid : "";

    const [dishes, setDishes] = useState();

    // Get all dishes from the current restaurant on page load
    useEffect(() => {
        const unsubscribe = () => {
            const handleGetDishes = async () => {
                const dishes = await getDishesByRestaurant(restaurantId);

                setDishes(dishes);
            };

            handleGetDishes();
        };

        // Stop listening to changes
        return unsubscribe();
    }, [getDishesByRestaurant, restaurantId]);

    return (
        <div className="page page--our-menu">
            <h1>Our Menu</h1>
            <div className="btns-container row">
                <div className="btns-container--item col-12 col-md-6">
                    <button
                        type="button"
                        onClick={() => window.location.assign(Routes.NEW_DISH)}
                        className="fill"
                    >
                        New dish
                    </button>
                </div>
                <div className="btns-container--item col-12 col-md-6">
                    <button
                        type="button"
                        onClick={() =>
                            window.location.assign(Routes.MANAGE_SIZES)
                        }
                        className="fill"
                    >
                        Manage sizes
                    </button>
                </div>
            </div>
            <div className="dishes-list row">
                {!!dishes && dishes.length > 0 ? (
                    dishes.map((dish) => (
                        <div className="col-6 col-md-4 col-lg-3" key={dish.id}>
                            <a
                                href={Routes.DISH_DETAIL.replace(
                                    ":id",
                                    dish.id
                                )}
                                className="dishes-list--item"
                            >
                                <div className="card">
                                    <img
                                        src={dish.thumbnail.url}
                                        alt={dish.name}
                                        className="card-thumbnail"
                                    />
                                    <div className="overlay"></div>
                                    <h3 className="card-title">{dish.name}</h3>
                                </div>
                            </a>
                        </div>
                    ))
                ) : (
                    <h3>No dishes found</h3>
                )}
            </div>
        </div>
    );
};
