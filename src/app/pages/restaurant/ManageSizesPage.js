// Imports
import React, { useState, useEffect } from "react";
import * as Feather from "react-feather";

import { useAuth, useFirestore } from "../../services";

import * as Routes from "../../routes";

import "./ManageSizesPage.scss";

// Page content
export const ManageSizesPage = ({ children }) => {
    // Define variables and states
    const { user } = useAuth();
    const { getSizesByRestaurant } = useFirestore();

    const [sizes, setSizes] = useState([]);

    useEffect(() => {
        const handleSetSizes = async () => {
            const restaurantId = user ? user.uid : "";
            const sizes = await getSizesByRestaurant(restaurantId);
            if (sizes) console.log(sizes);
            setSizes(sizes);
        };
        handleSetSizes();
    }, [getSizesByRestaurant, user]);

    return (
        <div className="page page--manage-sizes">
            <div className="back-btn">
                <Feather.ArrowLeftCircle
                    onClick={() => window.location.assign(Routes.OUR_MENU)}
                    className="btn-icon"
                />
            </div>
            <h1>Manage Sizes</h1>
            <p>
                By using a simple drag and drop you can order your sizes the way
                you want your customers to see them.
            </p>
            <div className="sizes-list row">
                <div className="sizes-list--item col-12 col-md-6 col-lg-4">
                    <button type="button" className="fill">
                        <Feather.Plus /> Add size
                    </button>
                </div>
            </div>
        </div>
    );
};
