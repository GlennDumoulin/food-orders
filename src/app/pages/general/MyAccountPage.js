// Imports
import React, { useState, useEffect, Fragment } from "react";

import { useFirestore } from "../../services";

import "./MyAccountPage.scss";

// Page content
export const MyAccountPage = ({ children }) => {
    // Defining variables and states
    const { getUserById, getRestaurantById, type, user, loading } =
        useFirestore();

    const [currentUser, setCurrentUser] = useState();

    // Get the current user data on page load
    useEffect(() => {
        const unsubscribe = () => {
            const handleGetData = async () => {
                let currentUser = {};

                if (!loading) {
                    if (type !== "restaurant") {
                        currentUser = await getUserById(user.uid);
                    } else {
                        currentUser = await getRestaurantById(user.uid);
                    }
                }

                setCurrentUser(currentUser);
            };

            handleGetData();
        };

        // Stop listening to changes
        return unsubscribe();
    }, [getUserById, getRestaurantById, user, type, loading]);

    return (
        <div className="page page--my-account">
            {!loading && (
                <Fragment>
                    {type !== "restaurant" ? (
                        <Fragment>
                            <h1 className="no-margin">{currentUser.name}</h1>
                            <p>{currentUser.email}</p>
                        </Fragment>
                    ) : (
                        <Fragment>
                            <h1 className="no-margin">{currentUser.name}</h1>
                            <h3>
                                {currentUser.address}, <br />{" "}
                                {currentUser.postalCode} {currentUser.city}
                            </h3>
                        </Fragment>
                    )}
                    {type === "user" && (
                        <p>
                            By login in with Amazon you can start creating and
                            managing your orders using Amazon Alexa.
                        </p>
                    )}
                    <div className="btns-container row justify-content-between">
                        <div className="col-12 col-md-6">
                            <button
                                type="button"
                                onClick={() => console.log("Change password")}
                                className="fill"
                            >
                                Change password
                            </button>
                        </div>
                        {type === "user" && (
                            <a href id="LoginWithAmazon">
                                <img
                                    src="https://images-na.ssl-images-amazon.com/images/G/01/lwa/btnLWA_gold_312x64.png"
                                    alt="Login with Amazon"
                                />
                            </a>
                        )}
                    </div>
                </Fragment>
            )}
        </div>
    );
};
