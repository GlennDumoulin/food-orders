// Imports
import React, { useContext } from "react";
import "firebase/storage";

import { useFirebase } from "./firebase.services";

// Create Context for Cloud Storage
const StorageContext = React.createContext(null);
const useStorage = () => useContext(StorageContext);

// Create Provider for Cloud Storage
const StorageProvider = ({ children }) => {
    // Defining variables
    const { app } = useFirebase();
    const storage = app.storage();

    /**
     * Upload an image to Cloud Storage
     * @param {String} folder
     * @param {String} subfolder
     * @param {String} fileName
     * @param {Object} file
     * @returns downloadUrl & metadata|error
     */
    const uploadImg = async (folder, subfolder, fileName, file) => {
        const searchRegExp = new RegExp(" ", "g");
        const storageRef = storage.ref();
        const fileRef = storageRef.child(
            `${folder}/${subfolder.replace(
                searchRegExp,
                "_"
            )}/${fileName.replace(searchRegExp, "_")}`
        );

        await fileRef.put(file);

        const downloadUrl = await fileRef.getDownloadURL();
        const metadata = await fileRef.getMetadata();

        return {
            downloadUrl: downloadUrl,
            ...metadata,
        };
    };

    /**
     * Delete an image from Cloud Storage
     * @param {String} filePath
     * @returns null|error
     */
    const deleteImg = async (filePath) => {
        const storageRef = storage.ref();
        const fileRef = storageRef.child(filePath);

        await fileRef.delete().then(() => {
            return null;
        });
    };

    // Return values
    const value = {
        uploadImg,
        deleteImg,
    };

    return (
        <StorageContext.Provider value={value}>
            {children}
        </StorageContext.Provider>
    );
};

export { StorageContext, StorageProvider, useStorage };
