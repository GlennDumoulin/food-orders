// Imports
import React from "react";

import "./Popup.scss";

// Popup content
const Popup = ({
    popupId,
    title,
    description = "",
    leftBtn = {
        type: "danger",
        cols: 6,
        name: "close",
    },
    rightBtn = {
        type: "confirm",
        cols: 6,
        name: "confirm",
    },
    formId,
    handleSubmit,
    children,
}) => {
    // Handle closing the popup & enable scrolling
    const handleClosePopup = () => {
        const popup = document.getElementById(popupId);
        popup.classList.add("hidden");

        const body = document.body;
        body.style.overflowX = "hidden";
        body.style.overflowY = "auto";
    };

    return (
        <div
            className="popup hidden fixed-top d-flex justify-content-center align-items-center"
            id={popupId}
        >
            <div className="card">
                <h3 className="card-title">{title}</h3>
                <p className="card-description">{description}</p>
                <form onSubmit={handleSubmit} id={formId} name={formId}>
                    {children}
                    <div className="card-btns-container row">
                        <div className={`col-${leftBtn.cols}`}>
                            <button
                                type="button"
                                onClick={handleClosePopup}
                                className={`${leftBtn.type} fill`}
                            >
                                {leftBtn.name}
                            </button>
                        </div>
                        <div className={`col-${rightBtn.cols}`}>
                            <button
                                type="submit"
                                className={`${rightBtn.type} fill`}
                            >
                                {rightBtn.name}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Popup;
