// Imports
import React, { useContext } from "react";
import "firebase/firestore";

import { useFirebase } from "./firebase.services";

// Create Context for Firestore
const FirestoreContext = React.createContext(null);
const useFirestore = () => useContext(FirestoreContext);

// Create Provider for Firestore
const FirestoreProvider = ({ children }) => {
    // Define variables
    const { app } = useFirebase();
    const db = app.firestore();

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
     * @returns querysnapshot|error
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
            .then((docref) => {
                return null;
            });
    };

    /**
     * Update the name of a size in Firestore
     * @param {Id} id
     * @param {String} name
     * @param {Number} index
     * @returns null|error
     */
    const updateSizeName = async (id, name) => {
        const sizeRef = db.collection("sizes").doc(id);

        return sizeRef
            .update({
                name: name,
            })
            .then((docref) => {
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

    const value = {
        addUser,
        addRestaurant,
        getSizesByRestaurant,
        addSize,
        updateSizeOrder,
        updateSizeName,
        deleteSize,
        getTypeByEmail,
    };

    return (
        <FirestoreContext.Provider value={value}>
            {children}
        </FirestoreContext.Provider>
    );
};

export { FirestoreContext, FirestoreProvider, useFirestore };
