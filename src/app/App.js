import React from "react";
import { BrowserRouter as Router, Redirect, Switch } from "react-router-dom";

import { RouteWithLayout } from "./utilities";

import { BaseLayout } from "./layouts";
import { HomePage } from "./pages";

import * as Routes from "./routes";

import "./App.scss";

function App() {
    return (
        <div className="app">
            <Router>
                <Switch>
                    <RouteWithLayout
                        exact
                        path={Routes.LANDING}
                        layout={BaseLayout}
                        component={HomePage}
                    />
                    <Redirect from={Routes.HOME} to={Routes.LANDING} />
                </Switch>
            </Router>
        </div>
    );
}

export default App;
