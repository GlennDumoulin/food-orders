// Imports
import React, { useContext } from "react";
import "firebase/firestore";

import { useFirebase } from "./firebase.services";

// Create Context for Firestore
const FirestoreContext = React.createContext(null);
const useFirestore = () => useContext(FirestoreContext);

// Create Provider for Firestore
const FirestoreProvider = ({ children }) => {
    const { app } = useFirebase();
    const db = app.firestore();

    return (
        <FirestoreContext.Provider value={{}}>
            {children}
        </FirestoreContext.Provider>
    );
};

export { FirestoreContext, FirestoreProvider, useFirestore };
