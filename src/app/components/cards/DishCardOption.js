// Imports
import React, { useState, useEffect } from "react";

import { useFirestore } from "../../services";

// Dish card option content
const DishCardOption = ({ price }) => {
    // Defining variables and states
    const { getSizeById } = useFirestore();

    const [size, setSize] = useState();
    const [loading, setLoading] = useState(true);

    // Get all prices from current dish from Firestore on page load
    useEffect(() => {
        const unsubscribe = () => {
            const handleGetSize = async () => {
                // Get size for current price
                const size = await getSizeById(price.sizeId);

                // Set current prices and order
                setSize(size);
                setLoading(false);
            };

            handleGetSize();
        };

        // Stop listening to changes
        return unsubscribe();
    }, [getSizeById, price]);

    if (loading) return null;

    return (
        <option value={price.id} data-order={size.order}>
            {size.name} (€{price.price})
        </option>
    );
};

export default DishCardOption;
