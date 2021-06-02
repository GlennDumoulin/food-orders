// Imports
import React from "react";

import { AppRouter } from "./components/router";

import {
    AuthProvider,
    FirebaseProvider,
    FirestoreProvider,
    StorageProvider,
} from "./services";

import "./App.scss";

// Firebase, Firestore and Auth Providers + App Router
function App() {
    return (
        <div className="app">
            <FirebaseProvider>
                <AuthProvider>
                    <FirestoreProvider>
                        <StorageProvider>
                            <AppRouter />
                        </StorageProvider>
                    </FirestoreProvider>
                </AuthProvider>
            </FirebaseProvider>
        </div>
    );
}

export default App;
