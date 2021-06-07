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
     * Upload an image to Cloud Storage
     * @param {String} folder
     * @param {String} subfolder
     * @param {String} fileName
     * @param {Object} file
     * @returns download url for uploaded image
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

        return await fileRef.getDownloadURL();
    };

    /**
     * Delete an image from Cloud Storage
     * @param {String} folder
     * @param {String} subfolder
     * @param {String} fileName
     * @returns null|error
     */
    const deleteImg = async (folder, subfolder, fileName) => {
        const searchRegExp = new RegExp(" ", "g");
        const storageRef = storage.ref();
        const fileRef = storageRef.child(
            `${folder}/${subfolder.replace(
                searchRegExp,
                "_"
            )}/${fileName.replace(searchRegExp, "_")}`
        );

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
