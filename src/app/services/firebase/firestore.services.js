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

    const value = {
        addUser,
        addRestaurant,
    };

    return (
        <FirestoreContext.Provider value={value}>
            {children}
        </FirestoreContext.Provider>
    );
};

export { FirestoreContext, FirestoreProvider, useFirestore };
