// Imports
import React, { useState } from "react";
import Checkbox from "@material-ui/core/Checkbox";

// Toggleable input content
const ToggleableInput = ({ size }) => {
    // Define state
    const [checked, setChecked] = useState(false);

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
                        name={`price-${size.name}`}
                        id={`price-${size.name}`}
                    />
                </div>
            )}
        </div>
    );
};

export default ToggleableInput;
