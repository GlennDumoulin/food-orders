// Imports
import React from "react";

import * as Routes from "../../routes";

import "./OurMenuPage.scss";

// Page content
export const OurMenuPage = ({ children }) => {
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
        </div>
    );
};
