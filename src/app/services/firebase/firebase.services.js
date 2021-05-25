// Imports
import React, { useContext, useState } from "react";
import firebase from "firebase/app";

import { firebaseConfig } from "../../config";

// Create Context for Firebase
const FirebaseContext = React.createContext(null);
const useFirebase = () => useContext(FirebaseContext);

// Create Provider for Firebase
const FirebaseProvider = ({ children }) => {
    const [app] = useState(
        !firebase.apps.length
            ? firebase.initializeApp(firebaseConfig)
            : firebase.app()
    );

    return (
        <FirebaseContext.Provider value={{ app }}>
            {children}
        </FirebaseContext.Provider>
    );
};

export { FirebaseContext, FirebaseProvider, useFirebase };
