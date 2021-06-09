// Imports
import React from "react";

import * as Routes from "../../routes";

import "./MyOverviewPage.scss";

// Page content
export const MyOverviewPage = ({ children }) => {
    return (
        <div className="page page--my-overview">
            <h1 className="brand">
                Welcome to
                <br />
                <span>F</span>ood<span>O</span>rders
            </h1>
            <h2>Upcoming orders</h2>
            <button
                type="button"
                className="fill"
                onClick={() => window.location.assign(Routes.MY_ORDERS)}
            >
                View all orders
            </button>
            <h2>Recent restaurants</h2>
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
