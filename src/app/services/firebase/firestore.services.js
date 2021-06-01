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
     * @param {String} name
     * @param {String} email
     * @returns null|error
     */
    const addUser = async (name, email) => {
        return db
            .collection("users")
            .add({
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
     * @param {String} name
     * @param {String} companyNumber
     * @param {String} email
     * @param {String} address
     * @param {String} city
     * @param {Number} postalCode
     * @param {URL} thumbnailUrl
     * @returns null|error
     */
    const addRestaurant = async (
        name,
        companyNumber,
        email,
        address,
        city,
        postalCode,
        thumbnailUrl
    ) => {
        return db
            .collection("restaurants")
            .add({
                restaurantName: name,
                companyNumber: companyNumber,
                email: email,
                address: address,
                city: city,
                postalCode: postalCode,
                thumbnailUrl: thumbnailUrl,
                acceptingOrders: false,
            })
            .then((docRef) => {
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
        getTypeByEmail,
    };

    return (
        <FirestoreContext.Provider value={value}>
            {children}
        </FirestoreContext.Provider>
    );
};

export { FirestoreContext, FirestoreProvider, useFirestore };
