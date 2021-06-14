// Imports
import React, { useContext, useState, useEffect } from "react";
import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";

import { useFirebase } from "./firebase.services";

// Create Context for Firestore
const FirestoreContext = React.createContext(null);
const useFirestore = () => useContext(FirestoreContext);

// Create Provider for Firestore
const FirestoreProvider = ({ children }) => {
    // Defining variables and states
    const { app } = useFirebase();
    const db = app.firestore();
    const auth = app.auth();

    const [user, setUser] = useState(null);
    const [type, setType] = useState("logged_out");
    const [loading, setLoading] = useState(true);

    /**
     * Get user by id from Firestore
     * @param {Id} id
     * @returns user|error
     */
    const getUserById = async (id) => {
        const userRef = db.collection("users").doc(id);
        const user = await userRef.get();

        return {
            id: user.id,
            ...user.data(),
        };
    };

    /**
     * Add user to Firestore
     * @param {Id} id
     * @param {String} name
     * @param {String} email
     * @returns null|error
     */
    const addUser = async (id, name, email) => {
        return db
            .collection("users")
            .doc(id)
            .set({
                name: name,
                email: email,
                amazonInfo: {
                    name: "",
                    email: "",
                },
                isAdmin: false,
            })
            .then((docRef) => {
                return null;
            });
    };

    /**
     * Update Amazon info of a user in Firestore
     * @param {Id} id
     * @param {String} amazonInfo
     * @returns null|error
     */
    const updateUserAmazonInfo = async (id, amazonInfo) => {
        const userRef = db.collection("users").doc(id);

        return userRef
            .update({
                amazonInfo: amazonInfo,
            })
            .then((docRef) => {
                return null;
            });
    };

    // Get all available restaurants
    const getRestaurants = async () => {
        const query = db
            .collection("restaurants")
            .where("acceptingOrders", "==", true);
        const querySnapshot = await query.get();

        const restaurants = querySnapshot.docs.map((doc) => {
            return {
                id: doc.id,
                ...doc.data(),
            };
        });
        return restaurants;
    };

    /**
     * Get restaurant by id from Firestore
     * @param {Id} id
     * @returns restaurant|error
     */
    const getRestaurantById = async (id) => {
        const restaurantRef = db.collection("restaurants").doc(id);
        const restaurant = await restaurantRef.get();

        return {
            id: restaurant.id,
            ...restaurant.data(),
        };
    };

    /**
     * Get a specified amount of restaurants from Firestore
     * @param {Number} amount
     * @returns restaurants|error
     */
    const getRecentRestaurants = async (amount) => {
        const query = db
            .collection("restaurants")
            .where("acceptingOrders", "==", true)
            .limit(amount);
        const querySnapshot = await query.get();

        const restaurants = querySnapshot.docs.map((doc) => {
            return {
                id: doc.id,
                ...doc.data(),
            };
        });
        return restaurants;
    };

    /**
     * Add restaurant to Firestore
     * @param {Id} id
     * @param {String} name
     * @param {String} companyNumber
     * @param {String} email
     * @param {String} address
     * @param {Number} postalCode
     * @param {String} city
     * @param {URL} thumbnailUrl
     * @param {String} thumbnailPath
     * @returns null|error
     */
    const addRestaurant = async (
        id,
        name,
        companyNumber,
        email,
        address,
        postalCode,
        city,
        thumbnailUrl,
        thumbnailPath
    ) => {
        return db
            .collection("restaurants")
            .doc(id)
            .set({
                name: name,
                companyNumber: companyNumber,
                email: email,
                address: address,
                postalCode: postalCode,
                city: city,
                thumbnail: {
                    url: thumbnailUrl,
                    path: thumbnailPath,
                },
                acceptingOrders: false,
            })
            .then((docRef) => {
                return null;
            });
    };

    /**
     * Get size by id from Firestore
     * @param {Id} id
     * @returns size|error
     */
    const getSizeById = async (id) => {
        const sizeRef = db.collection("sizes").doc(id);
        const size = await sizeRef.get();

        return {
            id: size.id,
            ...size.data(),
        };
    };

    /**
     * Get all sizes from a restaurant from Firestore
     * @param {Id} restaurantId
     * @returns sizes|error
     */
    const getSizesByRestaurant = async (restaurantId) => {
        const query = db
            .collection("sizes")
            .where("restaurantId", "==", restaurantId)
            .orderBy("order");
        const querySnapshot = await query.get();

        const sizes = querySnapshot.docs.map((doc) => {
            return {
                id: doc.id,
                ...doc.data(),
            };
        });
        return sizes;
    };

    /**
     * Add size to Firestore
     * @param {String} name
     * @param {Id} restaurantId
     * @returns null|error
     */
    const addSize = async (name, restaurantId) => {
        const currentSizes = await getSizesByRestaurant(restaurantId);
        const amountOfSizes = currentSizes.length;
        let nextOrderNr = 0;
        if (currentSizes.length > 0) {
            nextOrderNr = currentSizes[amountOfSizes - 1].order + 1;
        }

        return db
            .collection("sizes")
            .add({
                name: name,
                order: nextOrderNr,
                restaurantId: restaurantId,
            })
            .then((docRef) => {
                return null;
            });
    };

    /**
     * Update the order of a size in Firestore
     * @param {Object} size
     * @param {Number} index
     * @returns null|error
     */
    const updateSizeOrder = async (size, index) => {
        const sizeRef = db.collection("sizes").doc(size.id);

        return sizeRef
            .update({
                order: index,
            })
            .then((docRef) => {
                return null;
            });
    };

    /**
     * Update the name of a size in Firestore
     * @param {Id} id
     * @param {String} name
     * @returns null|error
     */
    const updateSizeName = async (id, name) => {
        const sizeRef = db.collection("sizes").doc(id);

        return sizeRef
            .update({
                name: name,
            })
            .then((docRef) => {
                return null;
            });
    };

    /**
     * Delete a size from Firestore
     * @param {Id} id
     * @returns null|error
     */
    const deleteSize = async (id) => {
        const sizeRef = db.collection("sizes").doc(id);

        return sizeRef.delete().then((docRef) => {
            return null;
        });
    };

    /**
     * Get a dish by id from Firestore
     * @param {Id} id
     * @returns dish|error
     */
    const getDishById = async (id) => {
        const dishRef = db.collection("dishes").doc(id);
        const dish = await dishRef.get();

        return {
            id: dish.id,
            ...dish.data(),
        };
    };

    /**
     * Get all dishes from a restaurant from Firestore
     * @param {Id} restaurantId
     * @returns dishes|error
     */
    const getDishesByRestaurant = async (restaurantId) => {
        const query = db
            .collection("dishes")
            .where("restaurantId", "==", restaurantId)
            .orderBy("name");
        const querySnapshot = await query.get();

        const dishes = querySnapshot.docs.map((doc) => {
            return {
                id: doc.id,
                ...doc.data(),
            };
        });
        return dishes;
    };

    /**
     * Add a dish to Firestore
     * @param {String} name
     * @param {String} description
     * @param {Url} thumbnailUrl
     * @param {String} thumbnailPath
     * @param {Id} restaurantId
     * @returns dishId|error
     */
    const addDish = async (
        name,
        description,
        thumbnailUrl,
        thumbnailPath,
        restaurantId
    ) => {
        return db
            .collection("dishes")
            .add({
                name: name,
                description: description,
                thumbnail: {
                    url: thumbnailUrl,
                    path: thumbnailPath,
                },
                restaurantId: restaurantId,
                available: true,
            })
            .then((docRef) => {
                return docRef.id;
            });
    };

    /**
     * Update a dish in Firestore
     * @param {Id} id
     * @param {String} name
     * @param {String} description
     * @param {Url} thumbnailUrl
     * @param {String} thumbnailPath
     * @returns null|error
     */
    const updateDish = async (
        id,
        name,
        description,
        thumbnailUrl,
        thumbnailPath
    ) => {
        const dishRef = db.collection("dishes").doc(id);

        return dishRef
            .update({
                name: name,
                description: description,
                thumbnail: {
                    url: thumbnailUrl,
                    path: thumbnailPath,
                },
            })
            .then((docRef) => {
                return null;
            });
    };

    /**
     * Update availability of a dish in Firestore
     * @param {Id} id
     * @param {Boolean} available
     * @returns null|error
     */
    const updateDishAvailablity = async (id, available) => {
        const dishRef = db.collection("dishes").doc(id);

        return dishRef
            .update({
                available: available,
            })
            .then((docRef) => {
                return null;
            });
    };

    /**
     * Delete a dish from Firestore
     * @param {Id} id
     * @returns null|error
     */
    const deleteDish = async (id) => {
        const dishRef = db.collection("dishes").doc(id);

        return dishRef.delete().then((docRef) => {
            return null;
        });
    };

    /**
     * Get a price by id from Firestore
     * @param {Id} id
     * @returns price|error
     */
    const getPriceById = async (id) => {
        const priceRef = db.collection("prices").doc(id);
        const price = await priceRef.get();

        return {
            id: price.id,
            ...price.data(),
        };
    };

    /**
     * Get all prices from a dish from Firestore
     * @param {Id} dishId
     * @returns prices|error
     */
    const getPricesByDishId = async (dishId) => {
        const query = db.collection("prices").where("dishId", "==", dishId);
        const querySnapshot = await query.get();

        const prices = querySnapshot.docs.map((doc) => {
            return {
                id: doc.id,
                ...doc.data(),
            };
        });
        return prices;
    };

    /**
     * Get all prices by sizeId from Firestore
     * @param {Id} sizeId
     * @returns prices|error
     */
    const getPricesBySizeId = async (sizeId) => {
        const query = db.collection("prices").where("sizeId", "==", sizeId);
        const querySnapshot = await query.get();

        const prices = querySnapshot.docs.map((doc) => {
            return {
                id: doc.id,
                ...doc.data(),
            };
        });
        return prices;
    };

    /**
     * Add a price to Firestore
     * @param {Id} dishId
     * @param {Id} sizeId
     * @param {Number} price
     * @returns priceId|error
     */
    const addPrice = async (dishId, sizeId, price) => {
        return db
            .collection("prices")
            .add({
                dishId: dishId,
                sizeId: sizeId,
                price: price,
            })
            .then((docRef) => {
                return docRef.id;
            });
    };

    /**
     * Update a price in Firestore
     * @param {Id} id
     * @param {Number} price
     * @returns null|error
     */
    const updatePrice = async (id, price) => {
        const priceRef = db.collection("prices").doc(id);

        return priceRef
            .update({
                price: price,
            })
            .then((docRef) => {
                return null;
            });
    };

    /**
     * Delete a price from Firestore
     * @param {Id} id
     * @returns null|error
     */
    const deletePrice = async (id) => {
        const priceRef = db.collection("prices").doc(id);

        return priceRef.delete().then((docRef) => {
            return null;
        });
    };

    /**
     * Get an order by id from Firestore
     * @param {Id} id
     * @returns order|error
     */
    const getOrderById = async (id) => {
        const orderRef = db.collection("orders").doc(id);
        const order = await orderRef.get();

        return {
            id: order.id,
            ...order.data(),
        };
    };

    /**
     * Get current order by user from Firestore
     * @param {Id} userId
     * @returns order|error
     */
    const getCurrentOrder = async (userId) => {
        const query = db
            .collection("orders")
            .where("userId", "==", userId)
            .where("status", "==", "Not yet placed");
        const querySnapshot = await query.get();

        const order = querySnapshot.docs.map((doc) => {
            return {
                id: doc.id,
                ...doc.data(),
            };
        });
        return order;
    };

    /**
     * Get all orders of the current user from Firestore
     * @param {Id} userId
     * @returns orders|error
     */
    const getOrdersByUser = async (userId) => {
        const query = db
            .collection("orders")
            .where("userId", "==", userId)
            .orderBy("pickupAt");
        const querySnapshot = await query.get();

        const orders = querySnapshot.docs.map((doc) => {
            return {
                id: doc.id,
                ...doc.data(),
            };
        });
        return orders;
    };

    /**
     * Get upcoming orders of the current user from Firestore
     * @param {Id} userId
     * @param {Number} amount
     * @returns orders|error
     */
    const getUpcomingOrders = async (userId, amount) => {
        const query = db
            .collection("orders")
            .where("userId", "==", userId)
            .where("status", "in", ["Awaiting acceptance", "Accepted", "Done"])
            .orderBy("pickupAt")
            .limit(amount);
        const querySnapshot = await query.get();

        const orders = querySnapshot.docs.map((doc) => {
            return {
                id: doc.id,
                ...doc.data(),
            };
        });
        return orders;
    };

    /**
     * Add an order to Firestore
     * @param {Id} userId
     * @param {Id} restaurantId
     * @param {Array} orderContent
     * @returns orderId|error
     */
    const addOrder = async (userId, restaurantId, orderContent) => {
        return db
            .collection("orders")
            .add({
                userId: userId,
                restaurantId: restaurantId,
                orderContent: orderContent,
                status: "Not yet placed",
                pickupAt: 0,
            })
            .then((docRef) => {
                return docRef.id;
            });
    };

    /**
     * Update the status of an order in Firestore
     * @param {Id} id
     * @param {String} status
     * @returns null|error
     */
    const updateOrderStatus = async (id, status) => {
        const orderRef = db.collection("orders").doc(id);

        return orderRef
            .update({
                status: status,
            })
            .then((docRef) => {
                return null;
            });
    };

    /**
     * Update the pickup time of an order in Firestore
     * @param {Id} id
     * @param {Date} pickup
     * @returns null|error
     */
    const updateOrderPickup = async (id, pickup) => {
        const orderRef = db.collection("orders").doc(id);

        return orderRef
            .update({
                pickupAt: pickup,
            })
            .then((docRef) => {
                return null;
            });
    };

    /**
     * Add item to the content of an order in Firestore
     * @param {Id} id
     * @param {Object} item
     * @returns null|error
     */
    const addOrderContent = async (id, item) => {
        const orderRef = db.collection("orders").doc(id);

        return orderRef
            .update({
                orderContent: firebase.firestore.FieldValue.arrayUnion(item),
            })
            .then((docRef) => {
                return null;
            });
    };

    /**
     * Delete item from the content of an order in Firestore
     * @param {Id} id
     * @param {Object} item
     * @returns null|error
     */
    const deleteOrderContent = async (id, item) => {
        const orderRef = db.collection("orders").doc(id);

        return orderRef
            .update({
                orderContent: firebase.firestore.FieldValue.arrayRemove(item),
            })
            .then((docRef) => {
                return null;
            });
    };

    /**
     * Delete an order from Firestore
     * @param {Id} id
     * @returns null|error
     */
    const deleteOrder = async (id) => {
        const orderRef = db.collection("orders").doc(id);

        return orderRef.delete().then((docRef) => {
            return null;
        });
    };

    // Set a global user variable if user state changes
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            if (user) {
                /**
                 * Get the type of the user based on the email
                 * @param {String} email
                 * @returns string|null
                 */
                const getTypeByEmail = async (email) => {
                    // Get user by email
                    const userQuery = db
                        .collection("users")
                        .where("email", "==", email)
                        .where("isAdmin", "==", false);
                    const userQuerySnapshot = await userQuery.get();

                    // Get admin by email
                    const adminQuery = db
                        .collection("users")
                        .where("email", "==", email)
                        .where("isAdmin", "==", true);
                    const adminQuerySnapshot = await adminQuery.get();

                    // Get restaurant by email
                    const restQuery = db
                        .collection("restaurants")
                        .where("email", "==", email);
                    const restQuerySnapshot = await restQuery.get();

                    // Return type
                    if (userQuerySnapshot?.docs.length > 0) {
                        return "user";
                    } else if (adminQuerySnapshot?.docs.length > 0) {
                        return "admin";
                    } else if (restQuerySnapshot?.docs.length > 0) {
                        return "restaurant";
                    } else {
                        return "logged_out";
                    }
                };

                setLoading(true);

                setUser(user);
                const userType = await getTypeByEmail(user.email);
                setType(userType);

                setLoading(false);
            } else {
                setLoading(true);

                setUser(null);
                setType("logged_out");

                setLoading(false);
            }
        });

        return () => unsubscribe();
    }, [auth, db]);

    // Return values
    const value = {
        getUserById,
        addUser,
        updateUserAmazonInfo,
        getRestaurants,
        getRestaurantById,
        getRecentRestaurants,
        addRestaurant,
        getSizeById,
        getSizesByRestaurant,
        addSize,
        updateSizeOrder,
        updateSizeName,
        deleteSize,
        getDishById,
        getDishesByRestaurant,
        addDish,
        updateDish,
        updateDishAvailablity,
        deleteDish,
        getPriceById,
        getPricesByDishId,
        getPricesBySizeId,
        addPrice,
        updatePrice,
        deletePrice,
        getOrderById,
        getCurrentOrder,
        getOrdersByUser,
        getUpcomingOrders,
        addOrder,
        updateOrderStatus,
        updateOrderPickup,
        addOrderContent,
        deleteOrderContent,
        deleteOrder,
        user,
        type,
        loading,
    };

    return (
        <FirestoreContext.Provider value={value}>
            {children}
        </FirestoreContext.Provider>
    );
};

export { FirestoreContext, FirestoreProvider, useFirestore };
