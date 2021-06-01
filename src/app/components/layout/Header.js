// Imports
import React, { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import * as Feather from "react-feather";

import { useAuth, useFirestore } from "../../services";

import * as Routes from "../../routes";

import "./Header.scss";

// Header content
const Header = ({ children }) => {
    // Define variables and states
    const { user, logout } = useAuth();
    const { getTypeByEmail } = useFirestore();

    const [showNav, setShowNav] = useState(false);
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

    // Close the navbar
    const closeNavbar = () => {
        setShowNav(false);
    };

    return (
        <header className="app-header">
            <nav className="navbar navbar-expand-md">
                <h1 className="navbar-brand">
                    {type === "logged_out" && (
                        <Link
                            to={Routes.HOME}
                            className="brand"
                            onClick={closeNavbar}
                        >
                            <span>F</span>ood
                            <br />
                            <span>O</span>rders
                        </Link>
                    )}
                    {type === "user" && (
                        <Link
                            to={Routes.MY_OVERVIEW}
                            className="brand"
                            onClick={closeNavbar}
                        >
                            <span>F</span>ood
                            <br />
                            <span>O</span>rders
                        </Link>
                    )}
                    {type === "restaurant" && (
                        <Link
                            to={Routes.ORDERS}
                            className="brand"
                            onClick={closeNavbar}
                        >
                            <span>F</span>ood
                            <br />
                            <span>O</span>rders
                        </Link>
                    )}
                    {type === "admin" && (
                        <Link
                            to={Routes.MANAGE_RESTAURANTS}
                            className="brand"
                            onClick={closeNavbar}
                        >
                            <span>F</span>ood
                            <br />
                            <span>O</span>rders
                        </Link>
                    )}
                </h1>
                <button
                    className="navbar-toggler"
                    type="button"
                    onClick={() => setShowNav(!showNav)}
                >
                    <span className="navbar-toggler-icon">
                        <Feather.Menu />
                    </span>
                </button>

                <div
                    className={
                        showNav
                            ? "collapse show navbar-collapse"
                            : "collapse navbar-collapse"
                    }
                >
                    {type === "logged_out" && (
                        <ul className="navbar-nav mr-auto justify-content-end flex-grow-1">
                            <li className="nav-item">
                                <NavLink
                                    to={Routes.LANDING}
                                    className="nav-link"
                                    activeClassName="active"
                                    onClick={closeNavbar}
                                >
                                    Home
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink
                                    to={Routes.REGISTER_LOGIN}
                                    className="nav-link"
                                    activeClassName="active"
                                    onClick={closeNavbar}
                                >
                                    Register/Login
                                </NavLink>
                            </li>
                        </ul>
                    )}
                    {type === "user" && (
                        <ul className="navbar-nav mr-auto justify-content-end flex-grow-1">
                            <li className="nav-item">
                                <NavLink
                                    to={Routes.MY_OVERVIEW}
                                    className="nav-link"
                                    activeClassName="active"
                                    onClick={closeNavbar}
                                >
                                    My overview
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink
                                    to={Routes.MY_ORDERS}
                                    className="nav-link"
                                    activeClassName="active"
                                    onClick={closeNavbar}
                                >
                                    My orders
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink
                                    to={Routes.RESTAURANTS}
                                    className="nav-link"
                                    activeClassName="active"
                                    onClick={closeNavbar}
                                >
                                    Restaurants
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink
                                    to={Routes.MY_ACCOUNT}
                                    className="nav-link"
                                    activeClassName="active"
                                    onClick={closeNavbar}
                                >
                                    <Feather.User /> My account
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink
                                    to={Routes.HOME}
                                    className="nav-link"
                                    activeClassName="active"
                                    onClick={() => {
                                        closeNavbar();
                                        logout();
                                    }}
                                >
                                    Log out
                                </NavLink>
                            </li>
                        </ul>
                    )}
                    {type === "restaurant" && (
                        <ul className="navbar-nav mr-auto justify-content-end flex-grow-1">
                            <li className="nav-item">
                                <NavLink
                                    to={Routes.ORDERS}
                                    className="nav-link"
                                    activeClassName="active"
                                    onClick={closeNavbar}
                                >
                                    Orders
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink
                                    to={Routes.OUR_MENU}
                                    className="nav-link"
                                    activeClassName="active"
                                    onClick={closeNavbar}
                                >
                                    Our menu
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink
                                    to={Routes.MY_ACCOUNT}
                                    className="nav-link"
                                    activeClassName="active"
                                    onClick={closeNavbar}
                                >
                                    <Feather.User /> My account
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink
                                    to={Routes.HOME}
                                    className="nav-link"
                                    activeClassName="active"
                                    onClick={() => {
                                        closeNavbar();
                                        logout();
                                    }}
                                >
                                    Log out
                                </NavLink>
                            </li>
                        </ul>
                    )}
                    {type === "admin" && (
                        <ul className="navbar-nav mr-auto justify-content-end flex-grow-1">
                            <li className="nav-item">
                                <NavLink
                                    to={Routes.MANAGE_RESTAURANTS}
                                    className="nav-link"
                                    activeClassName="active"
                                    onClick={closeNavbar}
                                >
                                    Restaurants
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink
                                    to={Routes.MANAGE_DISHES}
                                    className="nav-link"
                                    activeClassName="active"
                                    onClick={closeNavbar}
                                >
                                    Dishes
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink
                                    to={Routes.MY_ACCOUNT}
                                    className="nav-link"
                                    activeClassName="active"
                                    onClick={closeNavbar}
                                >
                                    <Feather.User /> My account
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink
                                    to={Routes.HOME}
                                    className="nav-link"
                                    activeClassName="active"
                                    onClick={() => {
                                        closeNavbar();
                                        logout();
                                    }}
                                >
                                    Log out
                                </NavLink>
                            </li>
                        </ul>
                    )}
                </div>
            </nav>
        </header>
    );
};

export default Header;
