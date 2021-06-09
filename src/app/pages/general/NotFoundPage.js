// Imports
import React from "react";

import * as Routes from "../../routes";

import "./NotFoundPage.scss";

// Page content
export const NotFoundPage = ({ children }) => {
    return (
        <div className="page page--not-found">
            <h1>Whoops, no food here!</h1>
            <p>
                It appears that something went wrong and the page you were
                looking for could not be found.
            </p>
            <button
                type="button"
                className="fill"
                onClick={() => window.location.assign(Routes.HOME)}
            >
                Go to homepage
            </button>
        </div>
    );
};
