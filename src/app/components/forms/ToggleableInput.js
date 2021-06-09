// Imports
import React, { useState } from "react";
import Checkbox from "@material-ui/core/Checkbox";

// Toggleable input content
const ToggleableInput = ({ size, price = undefined }) => {
    // Define state
    const [checked, setChecked] = useState(price ? true : false);
    const [value, setValue] = useState(price ? price.price : 0);

    return (
        <div className="form-group">
            <div className="form-item checkbox">
                <Checkbox
                    name={size.name}
                    id={size.name}
                    checked={checked}
                    value={size.id}
                    onChange={() => setChecked(!checked)}
                />
                <label>{size.name}</label>
            </div>
            {checked && (
                <div className="form-item">
                    <label htmlFor={`price-${size.name}`}>
                        Price - {size.name}
                    </label>
                    <input
                        type="number"
                        step={0.01}
                        required
                        value={value}
                        onChange={(ev) => setValue(ev.target.value)}
                        name={`price-${size.name}`}
                        id={`price-${size.name}`}
                    />
                </div>
            )}
        </div>
    );
};

export default ToggleableInput;
