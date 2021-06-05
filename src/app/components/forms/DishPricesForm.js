// Imports
import React, { useState } from "react";
import Checkbox from "@material-ui/core/Checkbox";

import * as Routes from "../../routes";

const DishPricesForm = ({ sizes, handleSubmit }) => {
    // Define states
    const [disabled, setDisabled] = useState(true);
    const [checked, setChecked] = useState(false);

    return !!sizes ? (
        <form
            name="dish-prices"
            id="dish-prices"
            onSubmit={handleSubmit}
            className="dish-prices"
        >
            {sizes.map((size) => {
                return (
                    // Make sizePrice component
                    <div className="form-item">
                        <Checkbox
                            checked={checked}
                            color={"#feb510"}
                            onChange={() => setChecked(!checked)}
                        />
                        <label>{size.name}</label>
                        {checked ? (
                            <p>Show price input</p>
                        ) : (
                            <p>Hide price input</p>
                        )}
                    </div>
                );
            })}
            <button
                type="submit"
                className={disabled ? "fill disabled" : "fill"}
                disabled={disabled}
            >
                Save prices changes
            </button>
        </form>
    ) : (
        <div className="no-sizes">
            <h3>No sizes found</h3>
            <p>Please manage your sizes before adding dishes.</p>
            <button
                type="button"
                onClick={() => window.location.assign(Routes.MANAGE_SIZES)}
                className="fill"
            >
                Start managing my sizes
            </button>
        </div>
    );
};

export default DishPricesForm;
