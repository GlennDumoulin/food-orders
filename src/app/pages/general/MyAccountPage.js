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
    const [loadingUser, setLoadingUser] = useState(true);

    // Handle login with Amazon
    const handleLWA = () => {
        let options = {};
        options.scope = "profile";
        options.pkce = true;
        // eslint-disable-next-line
        amazon.Login.authorize(options, (response) => {
            if (response.error) {
                alert("oauth error " + response.error);
                return;
            }
            // eslint-disable-next-line
            amazon.Login.retrieveToken(response.code, () => {
                if (response.error) {
                    alert("oauth error " + response.error);
                    return;
                }
                // eslint-disable-next-line
                amazon.Login.retrieveProfile(
                    response.access_token,
                    (response) => {
                        alert("Hello, " + response.profile.Name);
                        alert(
                            "Your e-mail address is " +
                                response.profile.PrimaryEmail
                        );
                        alert(
                            "Your unique ID is " + response.profile.CustomerId
                        );
                        console.log(response);

                        // hide LWA button & show unlink button
                        const LWA = document.getElementById("LoginWithAmazon");
                        const logout = document.getElementById("Logout");

                        LWA.classList.add("hidden");
                        logout.classList.remove("hidden");
                    }
                );
            });
            return false;
        });
    };

    // Handle unlinking Alexa
    const handleLogout = () => {
        // eslint-disable-next-line
        amazon.Login.logout();

        // hide unlink button & show LWA button
        const LWA = document.getElementById("LoginWithAmazon");
        const logout = document.getElementById("Logout");

        LWA.classList.remove("hidden");
        logout.classList.add("hidden");
    };

    // Get the current user data on page load
    useEffect(() => {
        const unsubscribe = () => {
            const handleGetData = async () => {
                if (!loading) {
                    if (type !== "restaurant") {
                        const currentUser = await getUserById(user.uid);
                        setCurrentUser(currentUser);
                        setLoadingUser(false);
                    } else {
                        const currentUser = await getRestaurantById(user.uid);
                        setCurrentUser(currentUser);
                        setLoadingUser(false);
                    }
                }
            };

            handleGetData();
        };

        // Stop listening to changes
        return unsubscribe();
    }, [getUserById, getRestaurantById, user, type, loading]);

    // Add the Amazon LWA SDK on page load
    window.onAmazonLoginReady = function () {
        // eslint-disable-next-line
        amazon.Login.setClientId(
            "amzn1.application-oa2-client.bc2b5e9667c0404697fe0a65751b49e4"
        );
    };
    (function (d) {
        let a = d.createElement("script");
        a.type = "text/javascript";
        a.async = true;
        a.id = "amazon-login-sdk";
        a.src = "https://assets.loginwithamazon.com/sdk/na/login1.js";
        const amazonRoot = d.getElementById("amazon-root");

        if (amazonRoot) {
            amazonRoot.appendChild(a);
        }
    })(document);

    return (
        <div className="page page--my-account">
            {!loading && !loadingUser && (
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
                        <p className="alexa-msg">
                            By login in with Amazon you can start creating and
                            managing your orders using Amazon Alexa.
                        </p>
                    )}
                    <div className="btns-container row justify-content-between align-items-center">
                        <div className="col-12 col-md-6">
                            <button
                                type="button"
                                onClick={() => console.log("Change password")}
                            >
                                Change password
                            </button>
                        </div>
                        {type === "user" && (
                            <div className="col-12 col-md-6">
                                <button
                                    type="button"
                                    id="LoginWithAmazon"
                                    onClick={handleLWA}
                                >
                                    <img
                                        src="https://images-na.ssl-images-amazon.com/images/G/01/lwa/btnLWA_gold_312x64.png"
                                        alt="Login with Amazon"
                                    />
                                </button>
                                <button
                                    type="button"
                                    id="Logout"
                                    onClick={handleLogout}
                                    className="hidden"
                                >
                                    Unlink Alexa
                                </button>
                            </div>
                        )}
                    </div>
                </Fragment>
            )}
            <div id="amazon-root"></div>
        </div>
    );
};
