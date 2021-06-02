// Imports
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import { useAuth, useFirestore } from "../../services";

import * as Routes from "../../routes";

import "./Footer.scss";

// Footer content
const Footer = ({ children }) => {
    // Define variables and states
    const { user } = useAuth();
    const { getTypeByEmail } = useFirestore();
    const [type, setType] = useState("");

    // Handle setting type of user
    const handleSetType = async () => {
        const userEmail = user ? user.email : "";
        const type = await getTypeByEmail(userEmail);
        setType(type);
    };

    // Set type of user on page load
    useEffect(() => {
        handleSetType();
    });

    return (
        <footer className="app-footer">
            <div className="footer-content container">
                <h1 className="footer-brand">
                    {type === "logged_out" && (
                        <Link to={Routes.HOME} className="brand">
                            <span>F</span>ood
                            <br />
                            <span>O</span>rders
                        </Link>
                    )}
                    {type === "user" && (
                        <Link to={Routes.MY_OVERVIEW} className="brand">
                            <span>F</span>ood
                            <br />
                            <span>O</span>rders
                        </Link>
                    )}
                    {type === "restaurant" && (
                        <Link to={Routes.ORDERS} className="brand">
                            <span>F</span>ood
                            <br />
                            <span>O</span>rders
                        </Link>
                    )}
                    {type === "admin" && (
                        <Link to={Routes.MANAGE_RESTAURANTS} className="brand">
                            <span>F</span>ood
                            <br />
                            <span>O</span>rders
                        </Link>
                    )}
                </h1>
                <div className="footer-contact">
                    <h2>Contact</h2>
                    <a href="mailto:info.foodorders@gmail.com">
                        info.foodorders@gmail.com
                    </a>
                    <p>+32 123 45 67 89</p>
                </div>
            </div>
            <div className="footer-legal">
                <span className="small">
                    © 2021 Arteveldehogeschool, opleiding Graduaat Programmeren
                </span>
            </div>
        </footer>
    );
};

export default Footer;
