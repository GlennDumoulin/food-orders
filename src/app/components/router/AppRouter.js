// Imports
import React from "react";
import { BrowserRouter as Router, Redirect, Switch } from "react-router-dom";

import { BaseLayout } from "../../layouts";
import * as Pages from "../../pages";
import * as Routes from "../../routes";
import { RouteWithLayout } from "../../utilities";

// App Router
const AppRouter = () => {
    return (
        <Router basename={"/food-orders.netlify.app"}>
            <Switch>
                <RouteWithLayout
                    exact
                    path={Routes.LANDING}
                    layout={BaseLayout}
                    component={Pages.HomePage}
                />
                <Redirect from={Routes.HOME} to={Routes.LANDING} />
                <RouteWithLayout
                    exact
                    path={Routes.REGISTER_LOGIN}
                    layout={BaseLayout}
                    component={Pages.RegisterLoginPage}
                />
                <RouteWithLayout
                    exact
                    path={Routes.FORGOT_PASSWORD}
                    layout={BaseLayout}
                    component={Pages.ForgotPasswordPage}
                />
                <RouteWithLayout
                    exact
                    path={Routes.RESET_PASSWORD}
                    layout={BaseLayout}
                    component={Pages.ResetPasswordPage}
                />
                <RouteWithLayout
                    exact
                    path={Routes.MY_OVERVIEW}
                    layout={BaseLayout}
                    component={Pages.MyOverviewPage}
                />
                <RouteWithLayout
                    exact
                    path={Routes.MY_ORDERS}
                    layout={BaseLayout}
                    component={Pages.MyOrdersPage}
                />
                <RouteWithLayout
                    exact
                    path={Routes.MY_ORDER_DETAIL}
                    layout={BaseLayout}
                    component={Pages.MyOrderDetailPage}
                />
                <RouteWithLayout
                    exact
                    path={Routes.RESTAURANTS}
                    layout={BaseLayout}
                    component={Pages.RestaurantsPage}
                />
                <RouteWithLayout
                    exact
                    path={Routes.RESTAURANT_MENU}
                    layout={BaseLayout}
                    component={Pages.RestaurantMenuPage}
                />
                <RouteWithLayout
                    exact
                    path={Routes.ORDERS}
                    layout={BaseLayout}
                    component={Pages.OrdersPage}
                />
                <RouteWithLayout
                    exact
                    path={Routes.ORDER_DETAIL}
                    layout={BaseLayout}
                    component={Pages.OrderDetailPage}
                />
                <RouteWithLayout
                    exact
                    path={Routes.OUR_MENU}
                    layout={BaseLayout}
                    component={Pages.OurMenuPage}
                />
                <RouteWithLayout
                    exact
                    path={Routes.NEW_DISH}
                    layout={BaseLayout}
                    component={Pages.NewDishPage}
                />
                <RouteWithLayout
                    exact
                    path={Routes.MANAGE_SIZES}
                    layout={BaseLayout}
                    component={Pages.ManageSizesPage}
                />
                <RouteWithLayout
                    exact
                    path={Routes.DISH_DETAIL}
                    layout={BaseLayout}
                    component={Pages.DishDetailPage}
                />
                <RouteWithLayout
                    exact
                    path={Routes.MANAGE_RESTAURANTS}
                    layout={BaseLayout}
                    component={Pages.ManageRestaurantsPage}
                />
                <RouteWithLayout
                    exact
                    path={Routes.MANAGE_DISHES}
                    layout={BaseLayout}
                    component={Pages.ManageDishesPage}
                />
                <RouteWithLayout
                    exact
                    path={Routes.MY_ACCOUNT}
                    layout={BaseLayout}
                    component={Pages.MyAccountPage}
                />
                <RouteWithLayout
                    layout={BaseLayout}
                    component={Pages.NotFoundPage}
                />
            </Switch>
        </Router>
    );
};

export default AppRouter;
