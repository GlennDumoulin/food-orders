// Imports
import React from "react";
import { Link } from "react-router-dom";

import * as Routes from "../../routes";
import { useFirestore } from "../../services";

import "./Footer.scss";

// Footer content
const Footer = ({ children }) => {
    // Define variables
    const { type, loading } = useFirestore();

    return (
        <footer className="app-footer">
            <div className="footer-content container">
                <h1 className="footer-brand">
                    {!loading && type === "logged_out" && (
                        <Link to={Routes.HOME} className="brand">
                            <span>F</span>ood
                            <br />
                            <span>O</span>rders
                        </Link>
                    )}
                    {!loading && type === "user" && (
                        <Link to={Routes.MY_OVERVIEW} className="brand">
                            <span>F</span>ood
                            <br />
                            <span>O</span>rders
                        </Link>
                    )}
                    {!loading && type === "restaurant" && (
                        <Link to={Routes.ORDERS} className="brand">
                            <span>F</span>ood
                            <br />
                            <span>O</span>rders
                        </Link>
                    )}
                    {!loading && type === "admin" && (
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
