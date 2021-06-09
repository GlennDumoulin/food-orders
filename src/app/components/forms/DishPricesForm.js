// Imports
import React from "react";

import { ToggleableInput } from "../../components/forms";

// Show the form for prices of a dish
const DishPricesForm = ({ sizes, dish, prices = [], handleSubmit }) => {
    return dish ? (
        <form
            name="dish-prices"
            id="dish-prices"
            onSubmit={handleSubmit}
            className="dish-prices"
        >
            {sizes.map((size) => {
                // Search price in current prices array
                const price = prices.find((price) => {
                    return price.dishId === dish.id && price.sizeId === size.id;
                });

                return (
                    <ToggleableInput size={size} price={price} key={size.id} />
                );
            })}
            <button type="submit" className="fill">
                Save prices changes
            </button>
        </form>
    ) : (
        <div className="no-dish">
            <h3>No dish found</h3>
            <p>Please add and save your info changes before adding prices.</p>
        </div>
    );
};

export default DishPricesForm;
