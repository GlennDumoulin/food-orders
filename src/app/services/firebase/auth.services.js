import React, { useContext, useState, useEffect } from "react";
import "firebase/auth";

import { useFirebase } from "./firebase.services";

const AuthContext = React.createContext(null);
const useAuth = () => useContext(AuthContext);

const AuthProvider = ({ children }) => {
    const { app } = useFirebase();
    const auth = app.auth();

    const [user, setUser] = useState(null);

    // login
    const login = (email, password) =>
        auth.signInWithEmailAndPassword(email, password);

    // register/signup
    const signup = (name, email, password) => {
        return auth
            .createUserWithEmailAndPassword(email, password)
            .then((response) => {
                response.user.updateProfile({
                    displayName: name,
                });
            });
    };

    // logout
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
