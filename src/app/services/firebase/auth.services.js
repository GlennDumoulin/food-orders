// Imports
import React, { useContext, useState, useEffect } from "react";
import firebase from "firebase/app";
import "firebase/auth";

import { useFirebase } from "./firebase.services";

// Create Context for Authentication
const AuthContext = React.createContext(null);
const useAuth = () => useContext(AuthContext);

// Create Provider for Authentication
const AuthProvider = ({ children }) => {
    // Define variables and states
    const { app } = useFirebase();
    const auth = app.auth();

    const [user, setUser] = useState(null);

    /**
     * Log the current user in
     * @param {String} email
     * @param {String} password
     * @returns null|error
     */
    const login = (email, password) =>
        auth.setPersistence(firebase.auth.Auth.Persistence.SESSION).then(() => {
            return auth.signInWithEmailAndPassword(email, password);
        });

    /**
     * Register/Signup the current user
     * @param {String} name
     * @param {String} email
     * @param {String} password
     * @returns return user|error
     */
    const signup = (name, email, password) => {
        return auth
            .setPersistence(firebase.auth.Auth.Persistence.SESSION)
            .then(() => {
                return auth
                    .createUserWithEmailAndPassword(email, password)
                    .then((response) => {
                        response.user.updateProfile({
                            displayName: name,
                        });
                        return response.user;
                    });
            });
    };

    // Log the current user out
    const logout = () => auth.signOut();

    /**
     * Re-authenticate the user
     * @param {string} password
     * @returns null|error
     */
    const reauthenticate = (password) => {
        const credential = firebase.auth.EmailAuthProvider.credential(
            user.email,
            password
        );
        return user.reauthenticateWithCredential(credential).then(() => {
            // User re-authenticated.
            return null;
        });
    };

    // Set a global user variable if user is signed in
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                setUser(user);
            } else {
                setUser(null);
            }
        });
        return () => unsubscribe();
    }, [auth]);

    const value = {
        user,
        login,
        logout,
        signup,
        reauthenticate,
    };

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
};

export { AuthContext, AuthProvider, useAuth };
