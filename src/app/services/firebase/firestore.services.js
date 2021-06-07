// Imports
import React, { useContext, useState, useEffect } from "react";
import "firebase/firestore";
import "firebase/auth";

import { useFirebase } from "./firebase.services";

// Create Context for Firestore
const FirestoreContext = React.createContext(null);
const useFirestore = () => useContext(FirestoreContext);

// Create Provider for Firestore
const FirestoreProvider = ({ children }) => {
    // Define variables and states
    const { app } = useFirebase();
    const db = app.firestore();
    const auth = app.auth();

    const [user, setUser] = useState(null);
    const [type, setType] = useState("logged_out");
    const [loading, setLoading] = useState(true);

    /**
     * Add user to Firestore
     * @param {Id} id
     * @param {String} name
     * @param {String} email
     * @returns null|error
     */
    const addUser = async (id, name, email) => {
        return db
            .collection("users")
            .doc(id)
            .set({
                name: name,
                email: email,
                linkedAlexaEmail: "",
                isAdmin: false,
            })
            .then((docRef) => {
                return null;
            });
    };

    /**
     * Add restaurant to Firestore
     * @param {Id} id
     * @param {String} name
     * @param {String} companyNumber
     * @param {String} email
     * @param {String} address
     * @param {Number} postalCode
     * @param {String} city
     * @param {URL} thumbnailUrl
     * @returns null|error
     */
    const addRestaurant = async (
        id,
        name,
        companyNumber,
        email,
        address,
        postalCode,
        city,
        thumbnailUrl
    ) => {
        return db
            .collection("restaurants")
            .doc(id)
            .set({
                restaurantName: name,
                companyNumber: companyNumber,
                email: email,
                address: address,
                postalCode: postalCode,
                city: city,
                thumbnailUrl: thumbnailUrl,
                acceptingOrders: false,
            })
            .then((docRef) => {
                return null;
            });
    };

    /**
     * Get all sizes from a restaurant
     * @param {Id} restaurantId
     * @returns sizes|error
     */
    const getSizesByRestaurant = async (restaurantId) => {
        const query = db
            .collection("sizes")
            .where("restaurantId", "==", restaurantId)
            .orderBy("order");
        const querySnapshot = await query.get();
        const sizes = querySnapshot.docs.map((doc) => {
            return {
                id: doc.id,
                ...doc.data(),
            };
        });
        return sizes;
    };

    /**
     * Add size to Firestore
     * @param {String} name
     * @param {Id} restaurantId
     * @returns null|error
     */
    const addSize = async (name, restaurantId) => {
        const currentSizes = await getSizesByRestaurant(restaurantId);
        const amountOfSizes = currentSizes.length;
        let nextOrderNr = 0;
        if (currentSizes.length > 0) {
            nextOrderNr = currentSizes[amountOfSizes - 1].order + 1;
        }

        return db
            .collection("sizes")
            .add({
                name: name,
                order: nextOrderNr,
                restaurantId: restaurantId,
            })
            .then((docRef) => {
                return null;
            });
    };

    /**
     * Update the order of a size in Firestore
     * @param {Object} size
     * @param {Number} index
     * @returns null|error
     */
    const updateSizeOrder = async (size, index) => {
        const sizeRef = db.collection("sizes").doc(size.id);

        return sizeRef
            .update({
                order: index,
            })
            .then((docRef) => {
                return null;
            });
    };

    /**
     * Update the name of a size in Firestore
     * @param {Id} id
     * @param {String} name
     * @returns null|error
     */
    const updateSizeName = async (id, name) => {
        const sizeRef = db.collection("sizes").doc(id);

        return sizeRef
            .update({
                name: name,
            })
            .then((docRef) => {
                return null;
            });
    };

    /**
     * Delete a size from Firestore
     * @param {Id} id
     * @returns null|error
     */
    const deleteSize = async (id) => {
        const sizeRef = db.collection("sizes").doc(id);

        return sizeRef.delete().then((docRef) => {
            return null;
        });
    };

    /**
     * Get a dish by id from Firestore
     * @param {Id} id
     * @returns dish|error
     */
    const getDishById = async (id) => {
        const dishRef = db.collection("dishes").doc(id);
        const dish = await dishRef.get();

        return {
            id: dish.id,
            ...dish.data(),
        };
    };

    /**
     * Add a dish to Firestore
     * @param {String} name
     * @param {String} description
     * @param {Url} thumbnailUrl
     * @param {Id} restaurantId
     * @returns dishId|error
     */
    const addDish = async (name, description, thumbnailUrl, restaurantId) => {
        return db
            .collection("dishes")
            .add({
                name: name,
                description: description,
                thumbnailUrl: thumbnailUrl,
                restaurantId: restaurantId,
                available: true,
            })
            .then((docRef) => {
                return docRef.id;
            });
    };

    /**
     * Update a dish in Firestore
     * @param {Id} id
     * @param {String} name
     * @param {String} description
     * @param {Url} thumbnailUrl
     * @returns null|error
     */
    const updateDish = async (id, name, description, thumbnailUrl) => {
        const dishRef = db.collection("dishes").doc(id);

        return dishRef
            .update({
                name: name,
                description: description,
                thumbnailUrl: thumbnailUrl,
                available: true,
            })
            .then((docRef) => {
                return null;
            });
    };

    /**
     * Get a price by id from Firestore
     * @param {Id} id
     * @returns price|error
     */
    const getPriceById = async (id) => {
        const priceRef = db.collection("prices").doc(id);
        const price = await priceRef.get();

        return {
            id: price.id,
            ...price.data(),
        };
    };

    /**
     * Get a price by dishId and sizeId from Firestore
     * @param {Id} dishId
     * @param {Id} sizeId
     * @returns price|error
     */
    const getPriceByDishAndSizeId = async (dishId, sizeId) => {
        const query = db
            .collection("prices")
            .where("dishId", "==", dishId)
            .where("sizeId", "==", sizeId);
        const querySnapshot = await query.get();
        const price = querySnapshot.docs.map((doc) => {
            return {
                id: doc.id,
                ...doc.data(),
            };
        });
        return price;
    };

    /**
     * Add a price to Firestore
     * @param {Id} dishId
     * @param {Id} sizeId
     * @param {Number} price
     * @returns priceId|error
     */
    const addPrice = async (dishId, sizeId, price) => {
        return db
            .collection("prices")
            .add({
                dishId: dishId,
                sizeId: sizeId,
                price: price,
            })
            .then((docRef) => {
                return docRef.id;
            });
    };

    /**
     * Update a price in Firestore
     * @param {Id} id
     * @param {Number} price
     * @returns null|error
     */
    const updatePrice = async (id, price) => {
        const priceRef = db.collection("prices").doc(id);

        return priceRef
            .update({
                price: price,
            })
            .then((docRef) => {
                return null;
            });
    };

    /**
     * Delete a price from Firestore
     * @param {Id} id
     * @returns null|error
     */
    const deletePrice = async (id) => {
        const priceRef = db.collection("prices").doc(id);

        return priceRef.delete().then((docRef) => {
            return null;
        });
    };

    // Set a global user variable if user state changes
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            if (user) {
                /**
                 * Get the type of the user based on the email
                 * @param {String} email
                 * @returns string|null
                 */
                const getTypeByEmail = async (email) => {
                    // Get user by email
                    const userQuery = db
                        .collection("users")
                        .where("email", "==", email)
                        .where("isAdmin", "==", false);
                    const userQuerySnapshot = await userQuery.get();

                    // Get admin by email
                    const adminQuery = db
                        .collection("users")
                        .where("email", "==", email)
                        .where("isAdmin", "==", true);
                    const adminQuerySnapshot = await adminQuery.get();

                    // Get restaurant by email
                    const restQuery = db
                        .collection("restaurants")
                        .where("email", "==", email);
                    const restQuerySnapshot = await restQuery.get();

                    // Return type
                    if (userQuerySnapshot?.docs.length > 0) {
                        return "user";
                    } else if (adminQuerySnapshot?.docs.length > 0) {
                        return "admin";
                    } else if (restQuerySnapshot?.docs.length > 0) {
                        return "restaurant";
                    } else {
                        return "logged_out";
                    }
                };

                setLoading(true);

                setUser(user);
                const userType = await getTypeByEmail(user.email);
                setType(userType);

                setLoading(false);
            } else {
                setLoading(true);

                setUser(null);
                setType("logged_out");

                setLoading(false);
            }
        });
        return () => unsubscribe();
    }, [auth, db]);

    // Return values
    const value = {
        addUser,
        addRestaurant,
        getSizesByRestaurant,
        addSize,
        updateSizeOrder,
        updateSizeName,
        deleteSize,
        getDishById,
        addDish,
        updateDish,
        getPriceById,
        getPriceByDishAndSizeId,
        addPrice,
        updatePrice,
        deletePrice,
        user,
        type,
        loading,
    };

    return (
        <FirestoreContext.Provider value={value}>
            {children}
        </FirestoreContext.Provider>
    );
};

export { FirestoreContext, FirestoreProvider, useFirestore };
