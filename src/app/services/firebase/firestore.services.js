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

    return (
        <FirestoreContext.Provider value={{ addUser }}>
            {children}
        </FirestoreContext.Provider>
    );
};

export { FirestoreContext, FirestoreProvider, useFirestore };
