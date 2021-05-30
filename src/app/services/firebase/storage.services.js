// Imports
import React, { useContext } from "react";
import "firebase/storage";

import { useFirebase } from "./firebase.services";

// Create Context for Cloud Storage
const StorageContext = React.createContext(null);
const useStorage = () => useContext(StorageContext);

// Create Provider for Cloud Storage
const StorageProvider = ({ children }) => {
    // Define variables
    const { app } = useFirebase();
    const storage = app.storage();

    /**
     * Upload an image to logos folder
     * @param {Object} file
     * @returns download url for uploaded image
     */
    const uploadLogo = async (file, restaurantName) => {
        const storageRef = storage.ref();
        const fileRef = storageRef.child(
            `logos/${restaurantName.replace(" ", "_")}/${file.name}`
        );

        await fileRef.put(file.name);

        return await fileRef.getDownloadURL();
    };

    const value = {
        uploadLogo,
    };

    return (
        <StorageContext.Provider value={value}>
            {children}
        </StorageContext.Provider>
    );
};

export { StorageContext, StorageProvider, useStorage };
