// Imports
import React, { useContext, useState, useEffect } from "react";
import "firebase/auth";

import { useFirebase } from "./firebase.services";

// Create Context for Authentication
const AuthContext = React.createContext(null);
const useAuth = () => useContext(AuthContext);

// Create Provider for Authentication
const AuthProvider = ({ children }) => {
    const { app } = useFirebase();
    const auth = app.auth();

    const [user, setUser] = useState(null);

    // Login
    const login = (email, password) =>
        auth.signInWithEmailAndPassword(email, password);

    // Register/Signup
    const signup = (name, email, password) => {
        return auth
            .createUserWithEmailAndPassword(email, password)
            .then((response) => {
                response.user.updateProfile({
                    displayName: name,
                });
            });
    };

    // Logout
    const logout = () => auth.signOut();

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
    };

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
};

export { AuthContext, AuthProvider, useAuth };
