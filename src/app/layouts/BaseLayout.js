// Imports
import React, { Fragment } from "react";

import { Header, Footer } from "../components/layout";

// Create a standard layout for the pages
const BaseLayout = ({ children }) => (
    <Fragment>
        <Header />
        <main className="app-main">{children}</main>
        <Footer />
    </Fragment>
);
export default BaseLayout;
